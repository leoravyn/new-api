package controller

import (
	"encoding/json"
	"maps"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/model"
	"github.com/QuantumNous/new-api/setting"
	"github.com/QuantumNous/new-api/setting/operation_setting"
	"github.com/gin-gonic/gin"
	"github.com/glebarez/sqlite"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

func setupReferralControllerTestDB(t *testing.T) {
	t.Helper()
	oldDB := model.DB
	oldLogDB := model.LOG_DB
	oldRedis := common.RedisEnabled
	oldQuotaPerUnit := common.QuotaPerUnit
	oldDisplayType := operation_setting.GetGeneralSetting().QuotaDisplayType
	oldPrice := operation_setting.Price
	oldWaffoPrice := setting.WaffoUnitPrice
	oldPancakePrice := setting.WaffoPancakeUnitPrice
	oldStripePrice := setting.StripeUnitPrice
	oldDiscounts := make(map[int]float64, len(operation_setting.GetPaymentSetting().AmountDiscount))
	maps.Copy(oldDiscounts, operation_setting.GetPaymentSetting().AmountDiscount)
	oldCompliance := operation_setting.GetPaymentSetting().ComplianceConfirmed
	oldVersion := operation_setting.GetPaymentSetting().ComplianceTermsVersion
	oldTopupGroupRatio := common.TopupGroupRatio2JSONString()
	oldEnabled := common.AffCommissionEnabled
	oldRate := common.AffCommissionRate
	oldCooldown := common.AffCommissionCooldownDays
	oldInviteDiscount := common.InviteFirstTopUpDiscount
	oldGinMode := gin.Mode()

	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	require.NoError(t, err)
	require.NoError(t, db.AutoMigrate(&model.User{}, &model.TopUp{}, &model.AffCommission{}, &model.Option{}, &model.Log{}, &model.SystemTask{}, &model.AuditLog{}))
	model.DB = db
	model.LOG_DB = db
	common.RedisEnabled = false
	gin.SetMode(gin.TestMode)

	t.Cleanup(func() {
		gin.SetMode(oldGinMode)
		model.DB = oldDB
		model.LOG_DB = oldLogDB
		common.RedisEnabled = oldRedis
		common.QuotaPerUnit = oldQuotaPerUnit
		operation_setting.GetGeneralSetting().QuotaDisplayType = oldDisplayType
		operation_setting.Price = oldPrice
		setting.WaffoUnitPrice = oldWaffoPrice
		setting.WaffoPancakeUnitPrice = oldPancakePrice
		setting.StripeUnitPrice = oldStripePrice
		operation_setting.GetPaymentSetting().AmountDiscount = oldDiscounts
		operation_setting.GetPaymentSetting().ComplianceConfirmed = oldCompliance
		operation_setting.GetPaymentSetting().ComplianceTermsVersion = oldVersion
		require.NoError(t, common.UpdateTopupGroupRatioByJSONString(oldTopupGroupRatio))
		common.AffCommissionEnabled = oldEnabled
		common.AffCommissionRate = oldRate
		common.AffCommissionCooldownDays = oldCooldown
		common.InviteFirstTopUpDiscount = oldInviteDiscount
		if sqlDB, dbErr := db.DB(); dbErr == nil {
			_ = sqlDB.Close()
		}
	})

	common.QuotaPerUnit = 500000
	operation_setting.GetGeneralSetting().QuotaDisplayType = operation_setting.QuotaDisplayTypeUSD
	operation_setting.Price = 7.0
	setting.WaffoUnitPrice = 1.0
	setting.WaffoPancakeUnitPrice = 1.0
	setting.StripeUnitPrice = 1.0
	operation_setting.GetPaymentSetting().AmountDiscount = map[int]float64{
		100: 0.95,
		200: 0.85,
	}
	operation_setting.GetPaymentSetting().ComplianceConfirmed = true
	operation_setting.GetPaymentSetting().ComplianceTermsVersion = operation_setting.CurrentComplianceTermsVersion
	require.NoError(t, common.UpdateTopupGroupRatioByJSONString(`{"default":1}`))
	common.AffCommissionEnabled = true
	common.AffCommissionRate = 0.05
	common.AffCommissionCooldownDays = 7
	common.InviteFirstTopUpDiscount = 0.9
}

func TestFirstTopUpDiscountOverridesTieredAcrossGatewaysAndTopUpInfo(t *testing.T) {
	setupReferralControllerTestDB(t)

	inviter := &model.User{Id: 10, Username: "ref_inviter", Password: "hashed-password", Status: common.UserStatusEnabled, AffCode: "INV1"}
	invitee := &model.User{Id: 11, Username: "ref_invitee", Password: "hashed-password", Status: common.UserStatusEnabled, InviterId: inviter.Id, AffCode: "INV2"}
	require.NoError(t, model.DB.Create(inviter).Error)
	require.NoError(t, model.DB.Create(invitee).Error)

	// Subscription mirror row with amount = 0 must NOT consume first-topup discount
	require.NoError(t, model.DB.Create(&model.TopUp{
		UserId:          invitee.Id,
		Amount:          0,
		Money:           29.0,
		TradeNo:         "SUB-MIRROR-CTRL-1",
		PaymentMethod:   model.PaymentMethodWaffoPancake,
		PaymentProvider: model.PaymentProviderWaffoPancake,
		CreateTime:      common.GetTimestamp(),
		CompleteTime:    common.GetTimestamp(),
		Status:          common.TopUpStatusSuccess,
	}).Error)

	// Eligible invited user gets 0.9 override across all 4 gateways, ignoring tiered 0.95 / 0.85!
	assert.InDelta(t, 200*7.0*0.9, getPayMoney(invitee.Id, 200, "default"), 1e-6)
	assert.InDelta(t, 200*1.0*0.9, getWaffoPancakePayMoney(invitee.Id, 200, "default"), 1e-6)
	assert.InDelta(t, 200*1.0*0.9, getWaffoPayMoney(invitee.Id, 200, "default"), 1e-6)
	assert.InDelta(t, 100*1.0*0.9, getStripePayMoney(invitee.Id, 100, "default"), 1e-6)
	assert.InDelta(t, 50*1.0*0.9, getWaffoPancakePayMoney(invitee.Id, 50, "default"), 1e-6)

	// GET /api/user/topup/info exposes eligibility=true and discount=0.9
	rec := httptest.NewRecorder()
	ctx, _ := gin.CreateTestContext(rec)
	ctx.Set("id", invitee.Id)
	ctx.Request = httptest.NewRequest(http.MethodGet, "/api/user/topup/info", nil)
	GetTopUpInfo(ctx)
	require.Equal(t, http.StatusOK, rec.Code)

	var topUpInfoResp struct {
		Success bool `json:"success"`
		Data    struct {
			FirstTopUpDiscountEligible bool    `json:"first_topup_discount_eligible"`
			FirstTopUpDiscount         float64 `json:"first_topup_discount"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(rec.Body.Bytes(), &topUpInfoResp))
	assert.True(t, topUpInfoResp.Success)
	assert.True(t, topUpInfoResp.Data.FirstTopUpDiscountEligible)
	assert.InDelta(t, 0.9, topUpInfoResp.Data.FirstTopUpDiscount, 1e-9)

	// Once a real wallet top-up succeeds (amount > 0), eligibility is burned and tiered discount resumes
	require.NoError(t, model.DB.Create(&model.TopUp{
		UserId:          invitee.Id,
		Amount:          50,
		Money:           45.0,
		TradeNo:         "WALLET-REAL-CTRL-1",
		PaymentMethod:   model.PaymentMethodWaffoPancake,
		PaymentProvider: model.PaymentProviderWaffoPancake,
		CreateTime:      common.GetTimestamp(),
		CompleteTime:    common.GetTimestamp(),
		Status:          common.TopUpStatusSuccess,
	}).Error)

	assert.InDelta(t, 200*7.0*0.85, getPayMoney(invitee.Id, 200, "default"), 1e-6)
	assert.InDelta(t, 200*1.0*0.85, getWaffoPancakePayMoney(invitee.Id, 200, "default"), 1e-6)
	assert.InDelta(t, 200*1.0*0.85, getWaffoPayMoney(invitee.Id, 200, "default"), 1e-6)
	assert.InDelta(t, 100*1.0*0.95, getStripePayMoney(invitee.Id, 100, "default"), 1e-6)

	rec2 := httptest.NewRecorder()
	ctx2, _ := gin.CreateTestContext(rec2)
	ctx2.Set("id", invitee.Id)
	ctx2.Request = httptest.NewRequest(http.MethodGet, "/api/user/topup/info", nil)
	GetTopUpInfo(ctx2)
	require.NoError(t, json.Unmarshal(rec2.Body.Bytes(), &topUpInfoResp))
	assert.False(t, topUpInfoResp.Data.FirstTopUpDiscountEligible)
}

func TestReferralSummaryAndCommissionsEndpoints(t *testing.T) {
	setupReferralControllerTestDB(t)

	now := common.GetTimestamp()
	inviter := &model.User{
		Id:       20,
		Username: "inviter_api",
		Email:    "inviter_secret@example.com",
		Password: "hashed-password",
		Status:   common.UserStatusEnabled,
		AffCode:  "", // verify auto-generation
	}
	invitee := &model.User{
		Id:        21,
		Username:  "alice",
		Email:     "alice_private@example.com",
		Password:  "hashed-password",
		Status:    common.UserStatusEnabled,
		InviterId: inviter.Id,
		AffCode:   "AL21",
	}
	require.NoError(t, model.DB.Create(inviter).Error)
	require.NoError(t, model.DB.Create(invitee).Error)

	require.NoError(t, model.DB.Create(&model.AffCommission{
		InviterId:       inviter.Id,
		InviteeId:       invitee.Id,
		TopUpId:         1,
		TradeNo:         "WAFFO_PANCAKE-TEST-1",
		PaymentProvider: model.PaymentProviderWaffoPancake,
		TopUpAmount:     100,
		TopUpMoney:      90.0,
		PaidUSD:         90.0,
		CommissionRate:  0.05,
		CommissionQuota: 2_250_000,
		Status:          model.AffCommissionStatusPending,
		CreatedAt:       now,
		SettleAt:        now + 7*86400,
	}).Error)

	// 1. GET /api/user/referral/summary
	rec := httptest.NewRecorder()
	ctx, _ := gin.CreateTestContext(rec)
	ctx.Set("id", inviter.Id)
	ctx.Request = httptest.NewRequest(http.MethodGet, "/api/user/referral/summary", nil)
	GetReferralSummary(ctx)
	require.Equal(t, http.StatusOK, rec.Code)

	var sumResp struct {
		Success bool                  `json:"success"`
		Message string                `json:"message"`
		Data    model.ReferralSummary `json:"data"`
	}
	require.NoError(t, json.Unmarshal(rec.Body.Bytes(), &sumResp))
	assert.True(t, sumResp.Success)
	assert.NotEmpty(t, sumResp.Data.AffCode)
	assert.True(t, sumResp.Data.CommissionEnabled)
	assert.InDelta(t, 0.05, sumResp.Data.CommissionRate, 1e-9)
	assert.Equal(t, 7, sumResp.Data.CooldownDays)
	assert.InDelta(t, 0.9, sumResp.Data.FirstTopUpDiscount, 1e-9)
	assert.Equal(t, int64(1), sumResp.Data.InvitedCount)
	assert.Equal(t, int64(1), sumResp.Data.QualifiedInviteeCount)
	assert.Equal(t, int64(2_250_000), sumResp.Data.PendingQuota)
	assert.Equal(t, int64(0), sumResp.Data.SettledQuota)
	assert.Equal(t, int64(2_250_000), sumResp.Data.TotalCommissionQuota)
	assert.True(t, sumResp.Data.ComplianceConfirmed)

	// 2. GET /api/user/referral/commissions
	rec2 := httptest.NewRecorder()
	ctx2, _ := gin.CreateTestContext(rec2)
	ctx2.Set("id", inviter.Id)
	ctx2.Request = httptest.NewRequest(http.MethodGet, "/api/user/referral/commissions?p=1&page_size=20&status=pending", nil)
	GetReferralCommissions(ctx2)
	require.Equal(t, http.StatusOK, rec2.Code)

	rawBody := rec2.Body.String()
	// Privacy check: raw email, full username, and invitee_id must never appear in response
	assert.NotContains(t, rawBody, "alice_private@example.com")
	assert.NotContains(t, rawBody, `"invitee_id"`)
	assert.NotContains(t, rawBody, `"alice"`)

	var listResp struct {
		Success bool `json:"success"`
		Data    struct {
			Page     int                            `json:"page"`
			PageSize int                            `json:"page_size"`
			Total    int                            `json:"total"`
			Items    []model.ReferralCommissionItem `json:"items"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(rec2.Body.Bytes(), &listResp))
	assert.True(t, listResp.Success)
	assert.Equal(t, 1, listResp.Data.Page)
	assert.Equal(t, 20, listResp.Data.PageSize)
	assert.Equal(t, 1, listResp.Data.Total)
	require.Len(t, listResp.Data.Items, 1)
	assert.Equal(t, "al***e", listResp.Data.Items[0].InviteeMasked)
	assert.Equal(t, "WAFFO_PANCAKE-TEST-1", listResp.Data.Items[0].TradeNo)
	assert.InDelta(t, 90.0, listResp.Data.Items[0].PaidUSD, 1e-6)
	assert.Equal(t, 2_250_000, listResp.Data.Items[0].CommissionQuota)

	// 3. Invalid status parameter rejected
	rec3 := httptest.NewRecorder()
	ctx3, _ := gin.CreateTestContext(rec3)
	ctx3.Set("id", inviter.Id)
	ctx3.Request = httptest.NewRequest(http.MethodGet, "/api/user/referral/commissions?status=bogus", nil)
	GetReferralCommissions(ctx3)
	var errResp struct {
		Success bool `json:"success"`
	}
	require.NoError(t, json.Unmarshal(rec3.Body.Bytes(), &errResp))
	assert.False(t, errResp.Success)
}

func TestUpdateOptionAffCommissionComplianceAndValidation(t *testing.T) {
	setupReferralControllerTestDB(t)
	if common.OptionMap == nil {
		common.OptionMap = make(map[string]string)
	}

	// Unconfirmed compliance blocks enabling AffCommissionEnabled or positive AffCommissionRate
	operation_setting.GetPaymentSetting().ComplianceConfirmed = false

	callUpdate := func(body string) (bool, string) {
		rec := httptest.NewRecorder()
		ctx, _ := gin.CreateTestContext(rec)
		ctx.Request = httptest.NewRequest(http.MethodPut, "/api/option/", strings.NewReader(body))
		ctx.Request.Header.Set("Content-Type", "application/json")
		UpdateOption(ctx)
		var resp struct {
			Success bool   `json:"success"`
			Message string `json:"message"`
		}
		require.NoError(t, json.Unmarshal(rec.Body.Bytes(), &resp))
		return resp.Success, resp.Message
	}

	ok, _ := callUpdate(`{"key":"AffCommissionEnabled","value":true}`)
	assert.False(t, ok)
	ok, _ = callUpdate(`{"key":"AffCommissionRate","value":"0.05"}`)
	assert.False(t, ok)

	// Confirmed compliance allows valid values and rejects invalid ones
	operation_setting.GetPaymentSetting().ComplianceConfirmed = true

	ok, msg := callUpdate(`{"key":"AffCommissionRate","value":"0.08"}`)
	assert.True(t, ok, msg)
	assert.InDelta(t, 0.08, common.AffCommissionRate, 1e-9)

	ok, _ = callUpdate(`{"key":"AffCommissionRate","value":"1.5"}`)
	assert.False(t, ok)

	ok, msg = callUpdate(`{"key":"AffCommissionCooldownDays","value":14}`)
	assert.True(t, ok, msg)
	assert.Equal(t, 14, common.AffCommissionCooldownDays)

	ok, _ = callUpdate(`{"key":"AffCommissionCooldownDays","value":999}`)
	assert.False(t, ok)

	ok, msg = callUpdate(`{"key":"InviteFirstTopUpDiscount","value":"0.85"}`)
	assert.True(t, ok, msg)
	assert.InDelta(t, 0.85, common.InviteFirstTopUpDiscount, 1e-9)

	ok, _ = callUpdate(`{"key":"InviteFirstTopUpDiscount","value":"0"}`)
	assert.False(t, ok)
}
