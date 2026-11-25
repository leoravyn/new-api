package service

import (
	"testing"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/model"
	"github.com/glebarez/sqlite"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

func TestRunAffCommissionSettleOnce(t *testing.T) {
	oldDB := model.DB
	oldLogDB := model.LOG_DB
	oldRedis := common.RedisEnabled

	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	require.NoError(t, err)
	require.NoError(t, db.AutoMigrate(&model.User{}, &model.TopUp{}, &model.AffCommission{}, &model.Log{}))
	model.DB = db
	model.LOG_DB = db
	common.RedisEnabled = false

	t.Cleanup(func() {
		model.DB = oldDB
		model.LOG_DB = oldLogDB
		common.RedisEnabled = oldRedis
		if sqlDB, dbErr := db.DB(); dbErr == nil {
			_ = sqlDB.Close()
		}
	})

	now := common.GetTimestamp()
	inviter := &model.User{Id: 7001, Username: "svc_inviter", Password: "hashed-password", Status: common.UserStatusEnabled, Quota: 500, AffCode: "SV01"}
	invitee := &model.User{Id: 7002, Username: "svc_invitee", Password: "hashed-password", Status: common.UserStatusEnabled, InviterId: inviter.Id, AffCode: "SV02"}
	require.NoError(t, db.Create(inviter).Error)
	require.NoError(t, db.Create(invitee).Error)
	require.NoError(t, db.Create(&model.TopUp{
		UserId:          invitee.Id,
		Amount:          100,
		Money:           90.0,
		TradeNo:         "SVC-SETTLE-1",
		PaymentProvider: model.PaymentProviderWaffoPancake,
		Status:          common.TopUpStatusSuccess,
		CreateTime:      now - 8*86400,
		CompleteTime:    now - 8*86400,
	}).Error)
	require.NoError(t, db.Create(&model.AffCommission{
		InviterId:       inviter.Id,
		InviteeId:       invitee.Id,
		TradeNo:         "SVC-SETTLE-1",
		PaymentProvider: model.PaymentProviderWaffoPancake,
		TopUpAmount:     100,
		TopUpMoney:      90.0,
		PaidUSD:         90.0,
		CommissionRate:  0.05,
		CommissionQuota: 2_250_000,
		Status:          model.AffCommissionStatusPending,
		CreatedAt:       now - 8*86400,
		SettleAt:        now - 1,
	}).Error)

	RunAffCommissionSettleOnce()

	var reloadedInviter model.User
	require.NoError(t, db.First(&reloadedInviter, inviter.Id).Error)
	assert.Equal(t, 2_250_500, reloadedInviter.Quota)
	assert.Equal(t, 2_250_000, reloadedInviter.AffHistoryQuota)

	var comm model.AffCommission
	require.NoError(t, db.Where("trade_no = ?", "SVC-SETTLE-1").First(&comm).Error)
	assert.Equal(t, model.AffCommissionStatusSettled, comm.Status)
	assert.NotZero(t, comm.SettledAt)
}
