package model

import (
	"fmt"
	"testing"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/setting"
	"github.com/QuantumNous/new-api/setting/operation_setting"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func setupAffCommissionTestGlobals(t *testing.T) {
	t.Helper()
	oldEnabled := common.AffCommissionEnabled
	oldRate := common.AffCommissionRate
	oldCooldown := common.AffCommissionCooldownDays
	oldDiscount := common.InviteFirstTopUpDiscount
	oldQuotaPerUnit := common.QuotaPerUnit
	oldQuotaForInviter := common.QuotaForInviter
	oldQuotaForInvitee := common.QuotaForInvitee
	oldPrice := operation_setting.Price
	oldWaffoPrice := setting.WaffoUnitPrice
	oldPancakePrice := setting.WaffoPancakeUnitPrice
	oldCompliance := operation_setting.GetPaymentSetting().ComplianceConfirmed
	oldVersion := operation_setting.GetPaymentSetting().ComplianceTermsVersion

	t.Cleanup(func() {
		common.AffCommissionEnabled = oldEnabled
		common.AffCommissionRate = oldRate
		common.AffCommissionCooldownDays = oldCooldown
		common.InviteFirstTopUpDiscount = oldDiscount
		common.QuotaPerUnit = oldQuotaPerUnit
		common.QuotaForInviter = oldQuotaForInviter
		common.QuotaForInvitee = oldQuotaForInvitee
		operation_setting.Price = oldPrice
		setting.WaffoUnitPrice = oldWaffoPrice
		setting.WaffoPancakeUnitPrice = oldPancakePrice
		operation_setting.GetPaymentSetting().ComplianceConfirmed = oldCompliance
		operation_setting.GetPaymentSetting().ComplianceTermsVersion = oldVersion
	})

	common.AffCommissionEnabled = true
	common.AffCommissionRate = 0.05
	common.AffCommissionCooldownDays = 7
	common.InviteFirstTopUpDiscount = 0.9
	common.QuotaPerUnit = 500000
	common.QuotaForInviter = 0
	common.QuotaForInvitee = 0
	operation_setting.Price = 7.0
	setting.WaffoUnitPrice = 1.0
	setting.WaffoPancakeUnitPrice = 1.0
	operation_setting.GetPaymentSetting().ComplianceConfirmed = true
	operation_setting.GetPaymentSetting().ComplianceTermsVersion = operation_setting.CurrentComplianceTermsVersion
}

func insertReferralTestUser(t *testing.T, id int, username string, inviterId int, quota int, status int) *User {
	t.Helper()
	u := &User{
		Id:        id,
		Username:  username,
		Email:     username + "@example.com",
		Password:  "hashed-password-placeholder",
		Status:    status,
		Quota:     quota,
		InviterId: inviterId,
		AffCode:   fmt.Sprintf("AF%d", id),
	}
	require.NoError(t, DB.Create(u).Error)
	return u
}

func TestIsEligibleForInviteFirstTopUpDiscount(t *testing.T) {
	truncateTables(t)
	setupAffCommissionTestGlobals(t)

	inviter := insertReferralTestUser(t, 1001, "inviter_one", 0, 0, common.UserStatusEnabled)
	invitee := insertReferralTestUser(t, 1002, "invitee_one", inviter.Id, 0, common.UserStatusEnabled)
	organic := insertReferralTestUser(t, 1003, "organic_one", 0, 0, common.UserStatusEnabled)
	selfInv := insertReferralTestUser(t, 1004, "self_inviter", 1004, 0, common.UserStatusEnabled)

	// Eligible invited user with zero top-ups
	eligible, discount, err := IsEligibleForInviteFirstTopUpDiscount(invitee.Id)
	require.NoError(t, err)
	assert.True(t, eligible)
	assert.InDelta(t, 0.9, discount, 1e-9)

	// Non-invited and self-invited users are ineligible
	eligible, _, err = IsEligibleForInviteFirstTopUpDiscount(organic.Id)
	require.NoError(t, err)
	assert.False(t, eligible)

	eligible, _, err = IsEligibleForInviteFirstTopUpDiscount(selfInv.Id)
	require.NoError(t, err)
	assert.False(t, eligible)

	// Subscription mirror row (amount = 0, status = 'success') MUST NOT burn eligibility
	require.NoError(t, DB.Create(&TopUp{
		UserId:          invitee.Id,
		Amount:          0,
		Money:           19.99,
		TradeNo:         "SUB-MIRROR-001",
		PaymentMethod:   PaymentMethodWaffoPancake,
		PaymentProvider: PaymentProviderWaffoPancake,
		CreateTime:      common.GetTimestamp(),
		CompleteTime:    common.GetTimestamp(),
		Status:          common.TopUpStatusSuccess,
	}).Error)

	eligible, discount, err = IsEligibleForInviteFirstTopUpDiscount(invitee.Id)
	require.NoError(t, err)
	assert.True(t, eligible, "subscription amount=0 row must not burn first-topup eligibility")
	assert.InDelta(t, 0.9, discount, 1e-9)

	// Pending / failed / expired wallet top-ups MUST NOT burn eligibility
	for idx, st := range []string{common.TopUpStatusPending, common.TopUpStatusFailed, common.TopUpStatusExpired} {
		require.NoError(t, DB.Create(&TopUp{
			UserId:          invitee.Id,
			Amount:          50,
			Money:           45.0,
			TradeNo:         "NON-SUCCESS-" + st + string(rune('A'+idx)),
			PaymentMethod:   PaymentMethodWaffoPancake,
			PaymentProvider: PaymentProviderWaffoPancake,
			CreateTime:      common.GetTimestamp(),
			Status:          st,
		}).Error)
	}
	eligible, _, err = IsEligibleForInviteFirstTopUpDiscount(invitee.Id)
	require.NoError(t, err)
	assert.True(t, eligible)

	// Disabling discount (1.0) or unconfirmed compliance makes user ineligible
	common.InviteFirstTopUpDiscount = 1.0
	eligible, _, err = IsEligibleForInviteFirstTopUpDiscount(invitee.Id)
	require.NoError(t, err)
	assert.False(t, eligible)
	common.InviteFirstTopUpDiscount = 0.9

	operation_setting.GetPaymentSetting().ComplianceConfirmed = false
	eligible, _, err = IsEligibleForInviteFirstTopUpDiscount(invitee.Id)
	require.NoError(t, err)
	assert.False(t, eligible)
	operation_setting.GetPaymentSetting().ComplianceConfirmed = true

	// Completed real wallet top-up (amount > 0, status = 'success') burns eligibility
	require.NoError(t, DB.Create(&TopUp{
		UserId:          invitee.Id,
		Amount:          100,
		Money:           90.0,
		TradeNo:         "WALLET-SUCCESS-001",
		PaymentMethod:   PaymentMethodWaffoPancake,
		PaymentProvider: PaymentProviderWaffoPancake,
		CreateTime:      common.GetTimestamp(),
		CompleteTime:    common.GetTimestamp(),
		Status:          common.TopUpStatusSuccess,
	}).Error)

	eligible, discount, err = IsEligibleForInviteFirstTopUpDiscount(invitee.Id)
	require.NoError(t, err)
	assert.False(t, eligible)
	assert.InDelta(t, 1.0, discount, 1e-9)
}

func TestAffCommissionEpayCNYNormalizationAndIdempotency(t *testing.T) {
	truncateTables(t)
	setupAffCommissionTestGlobals(t)

	inviter := insertReferralTestUser(t, 2001, "epay_inviter", 0, 0, common.UserStatusEnabled)
	invitee := insertReferralTestUser(t, 2002, "epay_invitee", inviter.Id, 0, common.UserStatusEnabled)

	// Epay: Price=7.0 CNY/USD, Amount=100 USD, first-topup 0.9 discount => Money=630.0 CNY
	topUp := &TopUp{
		UserId:          invitee.Id,
		Amount:          100,
		Money:           630.0,
		TradeNo:         "EPAY-COMM-001",
		PaymentMethod:   "alipay",
		PaymentProvider: PaymentProviderEpay,
		CreateTime:      common.GetTimestamp(),
		Status:          common.TopUpStatusPending,
	}
	require.NoError(t, topUp.Insert())

	alreadyDone, err := RechargeEpay(topUp.TradeNo, "alipay", "127.0.0.1")
	require.NoError(t, err)
	assert.False(t, alreadyDone)

	// Replay callback must be idempotent
	alreadyDone, err = RechargeEpay(topUp.TradeNo, "alipay", "127.0.0.1")
	require.NoError(t, err)
	assert.True(t, alreadyDone)

	var comms []AffCommission
	require.NoError(t, DB.Where("trade_no = ?", topUp.TradeNo).Find(&comms).Error)
	require.Len(t, comms, 1)

	comm := comms[0]
	assert.Equal(t, inviter.Id, comm.InviterId)
	assert.Equal(t, invitee.Id, comm.InviteeId)
	assert.Equal(t, PaymentProviderEpay, comm.PaymentProvider)
	assert.Equal(t, int64(100), comm.TopUpAmount)
	assert.InDelta(t, 630.0, comm.TopUpMoney, 1e-6)
	// Critical: 630 CNY / 7.0 = 90.0 USD; 90 * 0.05 * 500000 = 2,250,000 quota (NOT 7x!)
	assert.InDelta(t, 90.0, comm.PaidUSD, 1e-6)
	assert.InDelta(t, 0.05, comm.CommissionRate, 1e-9)
	assert.Equal(t, 2_250_000, comm.CommissionQuota)
	assert.Equal(t, AffCommissionStatusPending, comm.Status)
	assert.Equal(t, comm.CreatedAt+7*86400, comm.SettleAt)
	assert.Zero(t, comm.SettledAt)

	// Direct duplicate CreateAffCommissionTx on same trade_no must be ignored via OnConflict DoNothing
	reloadedTopUp := GetTopUpByTradeNo(topUp.TradeNo)
	require.NotNil(t, reloadedTopUp)
	require.NoError(t, CreateAffCommissionTx(DB, reloadedTopUp))
	var count int64
	require.NoError(t, DB.Model(&AffCommission{}).Where("trade_no = ?", topUp.TradeNo).Count(&count).Error)
	assert.Equal(t, int64(1), count)
}

func TestAffCommissionCreatedAcrossAllSixCompletionPaths(t *testing.T) {
	truncateTables(t)
	setupAffCommissionTestGlobals(t)
	setting.WaffoUnitPrice = 2.0
	setting.WaffoPancakeUnitPrice = 1.0

	inviter := insertReferralTestUser(t, 2101, "all_inviter", 0, 0, common.UserStatusEnabled)
	invitee := insertReferralTestUser(t, 2102, "all_invitee", inviter.Id, 0, common.UserStatusEnabled)

	// 1. Waffo Pancake ($90 paid => 2,250,000 quota)
	require.NoError(t, (&TopUp{
		UserId: invitee.Id, Amount: 100, Money: 90.0, TradeNo: "PANCAKE-001",
		PaymentMethod: PaymentMethodWaffoPancake, PaymentProvider: PaymentProviderWaffoPancake,
		CreateTime: common.GetTimestamp(), Status: common.TopUpStatusPending,
	}).Insert())
	require.NoError(t, RechargeWaffoPancake("PANCAKE-001"))

	// 2. Waffo Standard (unitPrice=2.0, money=180 => paidUSD=90 => 2,250,000 quota)
	require.NoError(t, (&TopUp{
		UserId: invitee.Id, Amount: 100, Money: 180.0, TradeNo: "WAFFO-001",
		PaymentMethod: PaymentMethodWaffo, PaymentProvider: PaymentProviderWaffo,
		CreateTime: common.GetTimestamp(), Status: common.TopUpStatusPending,
	}).Insert())
	require.NoError(t, RechargeWaffo("WAFFO-001", "127.0.0.1"))

	// 3. Stripe ($100 paid => 2,500,000 quota)
	require.NoError(t, (&TopUp{
		UserId: invitee.Id, Amount: 100, Money: 100.0, TradeNo: "STRIPE-001",
		PaymentMethod: PaymentMethodStripe, PaymentProvider: PaymentProviderStripe,
		CreateTime: common.GetTimestamp(), Status: common.TopUpStatusPending,
	}).Insert())
	require.NoError(t, Recharge("STRIPE-001", "cus_test", "127.0.0.1"))

	// 4. Creem (Amount is quota, Money is USD $100 => 2,500,000 quota)
	require.NoError(t, (&TopUp{
		UserId: invitee.Id, Amount: 50_000_000, Money: 100.0, TradeNo: "CREEM-001",
		PaymentMethod: PaymentMethodCreem, PaymentProvider: PaymentProviderCreem,
		CreateTime: common.GetTimestamp(), Status: common.TopUpStatusPending,
	}).Insert())
	require.NoError(t, RechargeCreem("CREEM-001", "buyer@example.com", "buyer", "127.0.0.1"))

	// 5. ManualCompleteTopUp (Epay CNY: 700 CNY / 7.0 = $100 => 2,500,000 quota)
	require.NoError(t, (&TopUp{
		UserId: invitee.Id, Amount: 100, Money: 700.0, TradeNo: "MANUAL-001",
		PaymentMethod: "alipay", PaymentProvider: PaymentProviderEpay,
		CreateTime: common.GetTimestamp(), Status: common.TopUpStatusPending,
	}).Insert())
	require.NoError(t, ManualCompleteTopUp("MANUAL-001", "127.0.0.1"))
	// Replay ManualCompleteTopUp must remain idempotent
	require.NoError(t, ManualCompleteTopUp("MANUAL-001", "127.0.0.1"))

	expected := map[string]struct {
		paidUSD float64
		quota   int
	}{
		"PANCAKE-001": {paidUSD: 90.0, quota: 2_250_000},
		"WAFFO-001":   {paidUSD: 90.0, quota: 2_250_000},
		"STRIPE-001":  {paidUSD: 100.0, quota: 2_500_000},
		"CREEM-001":   {paidUSD: 100.0, quota: 2_500_000},
		"MANUAL-001":  {paidUSD: 100.0, quota: 2_500_000},
	}
	for tradeNo, want := range expected {
		var comm AffCommission
		require.NoError(t, DB.Where("trade_no = ?", tradeNo).First(&comm).Error, "missing commission for %s", tradeNo)
		assert.InDelta(t, want.paidUSD, comm.PaidUSD, 1e-6, tradeNo)
		assert.Equal(t, want.quota, comm.CommissionQuota, tradeNo)
		assert.Equal(t, AffCommissionStatusPending, comm.Status, tradeNo)
	}
}

func TestSettleDueAffCommissions_CreditsWalletCacheAndHandlesCancellations(t *testing.T) {
	truncateTables(t)
	setupAffCommissionTestGlobals(t)
	useUserCacheMiniRedis(t)

	now := common.GetTimestamp()

	inviter := insertReferralTestUser(t, 3001, "settle_inviter", 0, 1_000_000, common.UserStatusEnabled)
	invitee := insertReferralTestUser(t, 3002, "settle_invitee", inviter.Id, 0, common.UserStatusEnabled)
	disabledInvitee := insertReferralTestUser(t, 3003, "disabled_invitee", inviter.Id, 0, common.UserStatusDisabled)
	disabledInviter := insertReferralTestUser(t, 3004, "disabled_inviter", 0, 0, common.UserStatusDisabled)
	inviteeOfDisabled := insertReferralTestUser(t, 3005, "active_invitee2", disabledInviter.Id, 0, common.UserStatusEnabled)
	fullWalletInviter := insertReferralTestUser(t, 3006, "full_wallet_inviter", 0, common.MaxWalletQuota-100, common.UserStatusEnabled)
	inviteeOfFull := insertReferralTestUser(t, 3007, "invitee_of_full", fullWalletInviter.Id, 0, common.UserStatusEnabled)

	require.NoError(t, populateUserCache(*inviter))

	// Create backing top-ups
	topUps := []*TopUp{
		{UserId: invitee.Id, Amount: 100, Money: 90, TradeNo: "T-DUE", PaymentProvider: PaymentProviderWaffoPancake, Status: common.TopUpStatusSuccess, CreateTime: now - 8*86400, CompleteTime: now - 8*86400},
		{UserId: invitee.Id, Amount: 100, Money: 90, TradeNo: "T-FUTURE", PaymentProvider: PaymentProviderWaffoPancake, Status: common.TopUpStatusSuccess, CreateTime: now, CompleteTime: now},
		{UserId: invitee.Id, Amount: 100, Money: 90, TradeNo: "T-FAILED-TOPUP", PaymentProvider: PaymentProviderWaffoPancake, Status: common.TopUpStatusFailed, CreateTime: now - 8*86400},
		{UserId: disabledInvitee.Id, Amount: 100, Money: 90, TradeNo: "T-DISABLED-INVITEE", PaymentProvider: PaymentProviderWaffoPancake, Status: common.TopUpStatusSuccess, CreateTime: now - 8*86400, CompleteTime: now - 8*86400},
		{UserId: inviteeOfDisabled.Id, Amount: 100, Money: 90, TradeNo: "T-DISABLED-INVITER", PaymentProvider: PaymentProviderWaffoPancake, Status: common.TopUpStatusSuccess, CreateTime: now - 8*86400, CompleteTime: now - 8*86400},
		{UserId: inviteeOfFull.Id, Amount: 100, Money: 90, TradeNo: "T-WALLET-FULL", PaymentProvider: PaymentProviderWaffoPancake, Status: common.TopUpStatusSuccess, CreateTime: now - 8*86400, CompleteTime: now - 8*86400},
	}
	for _, tu := range topUps {
		require.NoError(t, tu.Insert())
	}

	comms := []*AffCommission{
		{InviterId: inviter.Id, InviteeId: invitee.Id, TradeNo: "T-DUE", PaymentProvider: PaymentProviderWaffoPancake, TopUpAmount: 100, TopUpMoney: 90, PaidUSD: 90, CommissionRate: 0.05, CommissionQuota: 2_250_000, Status: AffCommissionStatusPending, CreatedAt: now - 8*86400, SettleAt: now - 10},
		{InviterId: inviter.Id, InviteeId: invitee.Id, TradeNo: "T-FUTURE", PaymentProvider: PaymentProviderWaffoPancake, TopUpAmount: 100, TopUpMoney: 90, PaidUSD: 90, CommissionRate: 0.05, CommissionQuota: 2_250_000, Status: AffCommissionStatusPending, CreatedAt: now, SettleAt: now + 86400},
		{InviterId: inviter.Id, InviteeId: invitee.Id, TradeNo: "T-FAILED-TOPUP", PaymentProvider: PaymentProviderWaffoPancake, TopUpAmount: 100, TopUpMoney: 90, PaidUSD: 90, CommissionRate: 0.05, CommissionQuota: 2_250_000, Status: AffCommissionStatusPending, CreatedAt: now - 8*86400, SettleAt: now - 10},
		{InviterId: inviter.Id, InviteeId: disabledInvitee.Id, TradeNo: "T-DISABLED-INVITEE", PaymentProvider: PaymentProviderWaffoPancake, TopUpAmount: 100, TopUpMoney: 90, PaidUSD: 90, CommissionRate: 0.05, CommissionQuota: 2_250_000, Status: AffCommissionStatusPending, CreatedAt: now - 8*86400, SettleAt: now - 10},
		{InviterId: disabledInviter.Id, InviteeId: inviteeOfDisabled.Id, TradeNo: "T-DISABLED-INVITER", PaymentProvider: PaymentProviderWaffoPancake, TopUpAmount: 100, TopUpMoney: 90, PaidUSD: 90, CommissionRate: 0.05, CommissionQuota: 2_250_000, Status: AffCommissionStatusPending, CreatedAt: now - 8*86400, SettleAt: now - 10},
		{InviterId: fullWalletInviter.Id, InviteeId: inviteeOfFull.Id, TradeNo: "T-WALLET-FULL", PaymentProvider: PaymentProviderWaffoPancake, TopUpAmount: 100, TopUpMoney: 90, PaidUSD: 90, CommissionRate: 0.05, CommissionQuota: 2_250_000, Status: AffCommissionStatusPending, CreatedAt: now - 8*86400, SettleAt: now - 10},
	}
	for _, c := range comms {
		require.NoError(t, DB.Create(c).Error)
	}

	fetched, settled, cancelled, err := SettleDueAffCommissions(200)
	require.NoError(t, err)
	assert.Equal(t, 5, fetched)
	assert.Equal(t, 1, settled)
	assert.Equal(t, 3, cancelled)

	// Verify inviter wallet quota + aff_history + Redis cache updated, aff_quota unchanged
	var reloadedInviter User
	require.NoError(t, DB.First(&reloadedInviter, inviter.Id).Error)
	assert.Equal(t, 3_250_000, reloadedInviter.Quota)
	assert.Equal(t, 2_250_000, reloadedInviter.AffHistoryQuota)
	assert.Equal(t, 0, reloadedInviter.AffQuota)

	cached, err := cacheGetUserBase(inviter.Id)
	require.NoError(t, err)
	assert.Equal(t, 3_250_000, cached.Quota)

	// Verify system log recorded for inviter
	var logCount int64
	require.NoError(t, DB.Model(&Log{}).Where("user_id = ? AND type = ?", inviter.Id, LogTypeSystem).Count(&logCount).Error)
	assert.Equal(t, int64(1), logCount)

	// Verify each commission status and cancel reason
	checkStatus := func(tradeNo, wantStatus, wantReason string) {
		var c AffCommission
		require.NoError(t, DB.Where("trade_no = ?", tradeNo).First(&c).Error)
		assert.Equal(t, wantStatus, c.Status, tradeNo)
		assert.Equal(t, wantReason, c.CancelReason, tradeNo)
		if wantStatus != AffCommissionStatusPending {
			assert.NotZero(t, c.SettledAt, tradeNo)
		} else {
			assert.Zero(t, c.SettledAt, tradeNo)
		}
	}
	checkStatus("T-DUE", AffCommissionStatusSettled, "")
	checkStatus("T-FUTURE", AffCommissionStatusPending, "")
	checkStatus("T-FAILED-TOPUP", AffCommissionStatusCancelled, AffCommissionCancelTopUpNotSuccess)
	checkStatus("T-DISABLED-INVITEE", AffCommissionStatusCancelled, AffCommissionCancelInviteeDisabled)
	checkStatus("T-DISABLED-INVITER", AffCommissionStatusCancelled, AffCommissionCancelInviterDisabled)
	checkStatus("T-WALLET-FULL", AffCommissionStatusPending, "") // skipped without cancelling!

	// Re-run is idempotent: no further credits or cancellations
	fetched, settled, cancelled, err = SettleDueAffCommissions(200)
	require.NoError(t, err)
	assert.Equal(t, 1, fetched) // only T-WALLET-FULL remains due
	assert.Equal(t, 0, settled)
	assert.Equal(t, 0, cancelled)

	require.NoError(t, DB.First(&reloadedInviter, inviter.Id).Error)
	assert.Equal(t, 3_250_000, reloadedInviter.Quota)
}

func TestUserSignupIncrementsAffCountWhenQuotaForInviterIsZero(t *testing.T) {
	truncateTables(t)
	setupAffCommissionTestGlobals(t)
	common.QuotaForInviter = 0
	common.QuotaForInvitee = 0

	inviter := insertReferralTestUser(t, 4001, "zero_inviter", 0, 0, common.UserStatusEnabled)
	invitee1 := insertReferralTestUser(t, 4002, "zero_invitee1", inviter.Id, 0, common.UserStatusEnabled)
	invitee2 := insertReferralTestUser(t, 4003, "zero_invitee2", inviter.Id, 0, common.UserStatusEnabled)

	invitee1.finishInsert(inviter.Id)
	invitee2.FinalizeOAuthUserCreation(inviter.Id)

	var reloaded User
	require.NoError(t, DB.First(&reloaded, inviter.Id).Error)
	assert.Equal(t, 2, reloaded.AffCount)
	assert.Equal(t, 0, reloaded.AffQuota)
	assert.Equal(t, 0, reloaded.AffHistoryQuota)
}

func TestMaskReferralInviteeName(t *testing.T) {
	assert.Equal(t, "*", MaskReferralInviteeName(""))
	assert.Equal(t, "*", MaskReferralInviteeName("a"))
	assert.Equal(t, "a*", MaskReferralInviteeName("al"))
	assert.Equal(t, "b***b", MaskReferralInviteeName("bob"))
	assert.Equal(t, "a***x", MaskReferralInviteeName("alex"))
	assert.Equal(t, "al***e", MaskReferralInviteeName("alice"))
	assert.Equal(t, "张***丰", MaskReferralInviteeName("张三丰"))
	assert.Equal(t, "测试***户", MaskReferralInviteeName("测试邀请用户"))
}

func TestGetUserReferralSummaryAndCommissions(t *testing.T) {
	truncateTables(t)
	setupAffCommissionTestGlobals(t)

	now := common.GetTimestamp()
	inviter := insertReferralTestUser(t, 5001, "summary_inviter", 0, 0, common.UserStatusEnabled)
	inviter.AffCount = 1 // lower than live count (2) to verify max(aff_count, live_count)
	inviter.AffQuota = 100
	inviter.AffHistoryQuota = 5_000_000
	require.NoError(t, DB.Save(inviter).Error)

	u1 := insertReferralTestUser(t, 5002, "alice", inviter.Id, 0, common.UserStatusEnabled)
	u2 := insertReferralTestUser(t, 5003, "bob", inviter.Id, 0, common.UserStatusEnabled)

	require.NoError(t, DB.Create(&AffCommission{
		InviterId: inviter.Id, InviteeId: u1.Id, TradeNo: "SUM-1", PaymentProvider: PaymentProviderWaffoPancake,
		TopUpAmount: 100, TopUpMoney: 90, PaidUSD: 90, CommissionRate: 0.05, CommissionQuota: 2_250_000,
		Status: AffCommissionStatusPending, CreatedAt: now - 10, SettleAt: now + 86400,
	}).Error)
	require.NoError(t, DB.Create(&AffCommission{
		InviterId: inviter.Id, InviteeId: u1.Id, TradeNo: "SUM-2", PaymentProvider: PaymentProviderEpay,
		TopUpAmount: 100, TopUpMoney: 700, PaidUSD: 100, CommissionRate: 0.05, CommissionQuota: 2_500_000,
		Status: AffCommissionStatusSettled, CreatedAt: now - 5, SettleAt: now - 1, SettledAt: now - 1,
	}).Error)
	require.NoError(t, DB.Create(&AffCommission{
		InviterId: inviter.Id, InviteeId: u2.Id, TradeNo: "SUM-3", PaymentProvider: PaymentProviderEpay,
		TopUpAmount: 50, TopUpMoney: 350, PaidUSD: 50, CommissionRate: 0.05, CommissionQuota: 1_250_000,
		Status: AffCommissionStatusCancelled, CancelReason: AffCommissionCancelTopUpNotSuccess, CreatedAt: now - 20, SettleAt: now - 2, SettledAt: now - 2,
	}).Error)

	summary, err := GetUserReferralSummary(inviter)
	require.NoError(t, err)
	assert.Equal(t, inviter.AffCode, summary.AffCode)
	assert.True(t, summary.CommissionEnabled)
	assert.InDelta(t, 0.05, summary.CommissionRate, 1e-9)
	assert.Equal(t, 7, summary.CooldownDays)
	assert.InDelta(t, 0.9, summary.FirstTopUpDiscount, 1e-9)
	assert.Equal(t, int64(2), summary.InvitedCount)
	assert.Equal(t, int64(1), summary.QualifiedInviteeCount) // only u1 has pending/settled
	assert.Equal(t, int64(2_250_000), summary.PendingQuota)
	assert.Equal(t, int64(2_500_000), summary.SettledQuota)
	assert.Equal(t, int64(4_750_000), summary.TotalCommissionQuota)
	assert.Equal(t, 100, summary.LegacyAffQuota)
	assert.Equal(t, 5_000_000, summary.LegacyAffHistoryQuota)
	assert.True(t, summary.ComplianceConfirmed)

	page := &common.PageInfo{Page: 1, PageSize: 20}
	items, total, err := GetUserReferralCommissions(inviter.Id, "", page)
	require.NoError(t, err)
	assert.Equal(t, int64(3), total)
	require.Len(t, items, 3)
	assert.Equal(t, "SUM-2", items[0].TradeNo)
	assert.Equal(t, "al***e", items[0].InviteeMasked)
	assert.Equal(t, "SUM-1", items[1].TradeNo)
	assert.Equal(t, "SUM-3", items[2].TradeNo)
	assert.Equal(t, "b***b", items[2].InviteeMasked)

	pendingItems, pendingTotal, err := GetUserReferralCommissions(inviter.Id, AffCommissionStatusPending, page)
	require.NoError(t, err)
	assert.Equal(t, int64(1), pendingTotal)
	require.Len(t, pendingItems, 1)
	assert.Equal(t, "SUM-1", pendingItems[0].TradeNo)
}
