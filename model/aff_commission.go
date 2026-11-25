package model

import (
	"errors"
	"math"
	"strings"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/logger"
	"github.com/QuantumNous/new-api/setting"
	"github.com/QuantumNous/new-api/setting/operation_setting"
	"github.com/shopspring/decimal"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

const (
	AffCommissionStatusPending   = "pending"
	AffCommissionStatusSettled   = "settled"
	AffCommissionStatusCancelled = "cancelled"
)

const (
	AffCommissionCancelTopUpNotSuccess = "topup_not_success"
	AffCommissionCancelInviteeDisabled = "invitee_disabled"
	AffCommissionCancelInviterDisabled = "inviter_disabled"
)

var errAffCommissionSkipped = errors.New("aff commission settlement skipped")

type AffCommission struct {
	Id              int     `json:"id" gorm:"primaryKey"`
	InviterId       int     `json:"inviter_id" gorm:"not null;index:idx_aff_comm_inviter_created,priority:1;index:idx_aff_comm_inviter_status,priority:1"`
	InviteeId       int     `json:"invitee_id" gorm:"not null;index"`
	TopUpId         int     `json:"topup_id" gorm:"column:topup_id;not null;default:0"`
	TradeNo         string  `json:"trade_no" gorm:"type:varchar(255);not null;uniqueIndex"`
	PaymentProvider string  `json:"payment_provider" gorm:"type:varchar(50);not null;default:''"`
	TopUpAmount     int64   `json:"topup_amount" gorm:"column:topup_amount;not null;default:0"`
	TopUpMoney      float64 `json:"topup_money" gorm:"column:topup_money;not null;default:0"`
	PaidUSD         float64 `json:"paid_usd" gorm:"column:paid_usd;not null;default:0"`
	CommissionRate  float64 `json:"commission_rate" gorm:"not null;default:0"`
	CommissionQuota int     `json:"commission_quota" gorm:"type:bigint;not null;default:0"`
	Status          string  `json:"status" gorm:"type:varchar(20);not null;default:'pending';index:idx_aff_comm_inviter_status,priority:2;index:idx_aff_comm_status_settle,priority:1"`
	CancelReason    string  `json:"cancel_reason" gorm:"type:varchar(128);not null;default:''"`
	CreatedAt       int64   `json:"created_at" gorm:"type:bigint;not null;index:idx_aff_comm_inviter_created,priority:2"`
	SettleAt        int64   `json:"settle_at" gorm:"type:bigint;not null;index:idx_aff_comm_status_settle,priority:2"`
	SettledAt       int64   `json:"settled_at" gorm:"type:bigint;not null;default:0"`
}

func (AffCommission) TableName() string {
	return "aff_commissions"
}

type ReferralSummary struct {
	AffCode               string  `json:"aff_code"`
	CommissionEnabled     bool    `json:"commission_enabled"`
	CommissionRate        float64 `json:"commission_rate"`
	CooldownDays          int     `json:"cooldown_days"`
	FirstTopUpDiscount    float64 `json:"first_topup_discount"`
	InvitedCount          int64   `json:"invited_count"`
	QualifiedInviteeCount int64   `json:"qualified_invitee_count"`
	PendingQuota          int64   `json:"pending_quota"`
	SettledQuota          int64   `json:"settled_quota"`
	TotalCommissionQuota  int64   `json:"total_commission_quota"`
	LegacyAffQuota        int     `json:"legacy_aff_quota"`
	LegacyAffHistoryQuota int     `json:"legacy_aff_history_quota"`
	ComplianceConfirmed   bool    `json:"compliance_confirmed"`
}

type ReferralCommissionItem struct {
	Id              int     `json:"id"`
	InviteeMasked   string  `json:"invitee_masked"`
	TradeNo         string  `json:"trade_no"`
	PaymentProvider string  `json:"payment_provider"`
	TopUpAmount     int64   `json:"topup_amount"`
	PaidUSD         float64 `json:"paid_usd"`
	CommissionRate  float64 `json:"commission_rate"`
	CommissionQuota int     `json:"commission_quota"`
	Status          string  `json:"status"`
	CancelReason    string  `json:"cancel_reason"`
	CreatedAt       int64   `json:"created_at"`
	SettleAt        int64   `json:"settle_at"`
	SettledAt       int64   `json:"settled_at"`
}

// IsEligibleForInviteFirstTopUpDiscount returns whether userId qualifies for the
// invitee first-topup discount override. Subscription mirror rows in top_ups
// have amount = 0 and are intentionally excluded via `amount > 0`.
func IsEligibleForInviteFirstTopUpDiscount(userId int) (eligible bool, discount float64, err error) {
	if userId <= 0 || DB == nil {
		return false, 1.0, nil
	}
	if !operation_setting.IsPaymentComplianceConfirmed() {
		return false, 1.0, nil
	}
	d := common.InviteFirstTopUpDiscount
	if math.IsNaN(d) || math.IsInf(d, 0) || d <= 0 || d >= 1.0 {
		return false, 1.0, nil
	}

	var user User
	if err := DB.Select("id", "inviter_id").Where("id = ?", userId).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return false, 1.0, nil
		}
		return false, 1.0, err
	}
	if user.InviterId <= 0 || user.InviterId == user.Id {
		return false, 1.0, nil
	}

	var completedCount int64
	if err := DB.Model(&TopUp{}).
		Where("user_id = ? AND status = ? AND amount > 0", userId, common.TopUpStatusSuccess).
		Count(&completedCount).Error; err != nil {
		return false, 1.0, err
	}
	if completedCount > 0 {
		return false, 1.0, nil
	}
	return true, d, nil
}

func calcPaidUSDDecimal(topUp *TopUp) decimal.Decimal {
	if topUp == nil || topUp.Money <= 0 || math.IsNaN(topUp.Money) || math.IsInf(topUp.Money, 0) {
		return decimal.Zero
	}
	divisor := 1.0
	switch topUp.PaymentProvider {
	case PaymentProviderEpay:
		divisor = operation_setting.Price
	case PaymentProviderWaffo:
		divisor = setting.WaffoUnitPrice
	case PaymentProviderWaffoPancake:
		divisor = setting.WaffoPancakeUnitPrice
	case PaymentProviderStripe, PaymentProviderCreem:
		divisor = 1.0
	default:
		divisor = 1.0
	}
	if divisor <= 0 || math.IsNaN(divisor) || math.IsInf(divisor, 0) {
		divisor = 1.0
	}
	return decimal.NewFromFloat(topUp.Money).Div(decimal.NewFromFloat(divisor))
}

func calcPaidUSD(topUp *TopUp) float64 {
	paid := calcPaidUSDDecimal(topUp)
	if paid.LessThanOrEqual(decimal.Zero) {
		return 0
	}
	v, _ := paid.Round(6).Float64()
	return v
}

// CreateAffCommissionTx creates a pending affiliate commission record inside the
// top-up completion transaction immediately after crediting the invitee's wallet.
// It is idempotent on trade_no via unique index + OnConflict DoNothing.
func CreateAffCommissionTx(tx *gorm.DB, topUp *TopUp) error {
	if tx == nil || topUp == nil || topUp.UserId <= 0 || topUp.TradeNo == "" || topUp.Amount <= 0 || topUp.Money <= 0 {
		return nil
	}
	if !common.AffCommissionEnabled || !operation_setting.IsPaymentComplianceConfirmed() {
		return nil
	}
	rate := common.AffCommissionRate
	if math.IsNaN(rate) || math.IsInf(rate, 0) || rate <= 0 || rate > 1 {
		return nil
	}
	if common.QuotaPerUnit <= 0 || math.IsNaN(common.QuotaPerUnit) || math.IsInf(common.QuotaPerUnit, 0) {
		return nil
	}

	var invitee User
	if err := tx.Select("id", "inviter_id").Where("id = ?", topUp.UserId).First(&invitee).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil
		}
		return err
	}
	if invitee.InviterId <= 0 || invitee.InviterId == invitee.Id {
		return nil
	}

	paidUSDDec := calcPaidUSDDecimal(topUp)
	if paidUSDDec.LessThanOrEqual(decimal.Zero) {
		return nil
	}
	commissionDec := paidUSDDec.
		Mul(decimal.NewFromFloat(rate)).
		Mul(decimal.NewFromFloat(common.QuotaPerUnit)).
		Floor()
	if commissionDec.LessThanOrEqual(decimal.Zero) {
		return nil
	}
	commissionQuota, err := common.WalletQuotaFromDecimalStrict(commissionDec)
	if err != nil || commissionQuota <= 0 {
		return nil
	}

	createdAt := topUp.CompleteTime
	if createdAt <= 0 {
		createdAt = common.GetTimestamp()
	}
	cooldownDays := common.AffCommissionCooldownDays
	if cooldownDays < 0 {
		cooldownDays = 0
	}
	settleAt := createdAt + int64(cooldownDays)*86400
	paidUSD, _ := paidUSDDec.Round(6).Float64()

	record := &AffCommission{
		InviterId:       invitee.InviterId,
		InviteeId:       invitee.Id,
		TopUpId:         topUp.Id,
		TradeNo:         topUp.TradeNo,
		PaymentProvider: topUp.PaymentProvider,
		TopUpAmount:     topUp.Amount,
		TopUpMoney:      topUp.Money,
		PaidUSD:         paidUSD,
		CommissionRate:  rate,
		CommissionQuota: commissionQuota,
		Status:          AffCommissionStatusPending,
		CancelReason:    "",
		CreatedAt:       createdAt,
		SettleAt:        settleAt,
		SettledAt:       0,
	}
	return tx.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "trade_no"}},
		DoNothing: true,
	}).Create(record).Error
}

func cancelAffCommissionTx(tx *gorm.DB, comm *AffCommission, reason string, now int64) error {
	comm.Status = AffCommissionStatusCancelled
	comm.CancelReason = reason
	comm.SettledAt = now
	return tx.Save(comm).Error
}

func settleSingleAffCommission(id int, now int64) (settled bool, cancelled bool, err error) {
	var settledInviterId int
	var settledQuota int
	var settledTradeNo string

	err = DB.Transaction(func(tx *gorm.DB) error {
		var comm AffCommission
		if err := lockForUpdate(tx).Where("id = ?", id).First(&comm).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return nil
			}
			return err
		}
		if comm.Status != AffCommissionStatusPending || comm.SettleAt > now {
			return nil
		}

		// Verify source top-up is still completed.
		var topUp TopUp
		if err := tx.Where("trade_no = ?", comm.TradeNo).First(&topUp).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				cancelled = true
				return cancelAffCommissionTx(tx, &comm, AffCommissionCancelTopUpNotSuccess, now)
			}
			return err
		}
		if topUp.Status != common.TopUpStatusSuccess {
			cancelled = true
			return cancelAffCommissionTx(tx, &comm, AffCommissionCancelTopUpNotSuccess, now)
		}

		// Verify invitee is still active and not soft-deleted.
		var invitee User
		if err := tx.Unscoped().Select("id", "status", "deleted_at").Where("id = ?", comm.InviteeId).First(&invitee).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				cancelled = true
				return cancelAffCommissionTx(tx, &comm, AffCommissionCancelInviteeDisabled, now)
			}
			return err
		}
		if invitee.DeletedAt.Valid || invitee.Status != common.UserStatusEnabled {
			cancelled = true
			return cancelAffCommissionTx(tx, &comm, AffCommissionCancelInviteeDisabled, now)
		}

		// Verify inviter is still active and not soft-deleted.
		var inviter User
		if err := tx.Unscoped().Select("id", "status", "deleted_at").Where("id = ?", comm.InviterId).First(&inviter).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				cancelled = true
				return cancelAffCommissionTx(tx, &comm, AffCommissionCancelInviterDisabled, now)
			}
			return err
		}
		if inviter.DeletedAt.Valid || inviter.Status != common.UserStatusEnabled {
			cancelled = true
			return cancelAffCommissionTx(tx, &comm, AffCommissionCancelInviterDisabled, now)
		}

		// Atomically credit inviter's wallet quota + aff_history.
		if err := creditTopUpQuota(tx, comm.InviterId, comm.CommissionQuota, map[string]any{
			"aff_history": gorm.Expr("aff_history + ?", comm.CommissionQuota),
		}); err != nil {
			if errors.Is(err, ErrTopUpQuotaLimitExceeded) {
				common.SysLog(common.LogText("aff commission settlement skipped due to wallet quota ceiling: commission_id=%d inviter_id=%d quota=%d", comm.Id, comm.InviterId, comm.CommissionQuota))
				return errAffCommissionSkipped
			}
			return err
		}

		comm.Status = AffCommissionStatusSettled
		comm.SettledAt = now
		if err := tx.Save(&comm).Error; err != nil {
			return err
		}

		settled = true
		settledInviterId = comm.InviterId
		settledQuota = comm.CommissionQuota
		settledTradeNo = comm.TradeNo
		return nil
	})
	if err != nil {
		if errors.Is(err, errAffCommissionSkipped) {
			return false, false, nil
		}
		return false, false, err
	}

	if settled {
		syncCreditUserQuotaCache(settledInviterId, settledQuota, common.LogText("aff commission settlement"))
		if LOG_DB != nil {
			RecordLog(settledInviterId, LogTypeSystem, common.NewMessage(
				"Referral commission settled: {{quota}} (order {{trade_no}})",
				map[string]any{
					"quota":    logger.FormatQuota(settledQuota),
					"trade_no": settledTradeNo,
				},
			))
		}
	}
	return settled, cancelled, nil
}

// SettleDueAffCommissions processes up to batchSize pending commissions whose cooldown has elapsed.
func SettleDueAffCommissions(batchSize int) (fetched int, settledCount int, cancelledCount int, err error) {
	if DB == nil {
		return 0, 0, 0, nil
	}
	if batchSize <= 0 {
		batchSize = 200
	}
	now := common.GetTimestamp()
	var ids []int
	if err := DB.Model(&AffCommission{}).
		Where("status = ? AND settle_at <= ?", AffCommissionStatusPending, now).
		Order("settle_at ASC, id ASC").
		Limit(batchSize).
		Pluck("id", &ids).Error; err != nil {
		return 0, 0, 0, err
	}
	fetched = len(ids)
	for _, id := range ids {
		settled, cancelled, settleErr := settleSingleAffCommission(id, now)
		if settleErr != nil {
			common.SysError(common.LogText("failed to settle aff commission id=%d: %s", id, settleErr.Error()))
			continue
		}
		if settled {
			settledCount++
		} else if cancelled {
			cancelledCount++
		}
	}
	return fetched, settledCount, cancelledCount, nil
}

// MaskReferralInviteeName masks an invitee display name/username for privacy:
// len<=1 -> "*"; len==2 -> r[0]+"*"; len 3..4 -> r[0]+"***"+r[len-1]; len>=5 -> r[0:2]+"***"+r[len-1].
func MaskReferralInviteeName(name string) string {
	r := []rune(strings.TrimSpace(name))
	n := len(r)
	switch {
	case n <= 1:
		return "*"
	case n == 2:
		return string(r[0:1]) + "*"
	case n <= 4:
		return string(r[0:1]) + "***" + string(r[n-1:])
	default:
		return string(r[0:2]) + "***" + string(r[n-1:])
	}
}

func GetUserReferralSummary(user *User) (*ReferralSummary, error) {
	if user == nil {
		return nil, errors.New("user is nil")
	}

	var liveInvitedCount int64
	if err := DB.Model(&User{}).Where("inviter_id = ?", user.Id).Count(&liveInvitedCount).Error; err != nil {
		return nil, err
	}
	invitedCount := max(int64(user.AffCount), liveInvitedCount)

	var qualifiedCount int64
	if err := DB.Model(&AffCommission{}).
		Where("inviter_id = ? AND status IN ?", user.Id, []string{AffCommissionStatusPending, AffCommissionStatusSettled}).
		Distinct("invitee_id").
		Count(&qualifiedCount).Error; err != nil {
		return nil, err
	}

	type statusSumRow struct {
		Status string
		Total  int64
	}
	var sums []statusSumRow
	if err := DB.Model(&AffCommission{}).
		Select("status, COALESCE(SUM(commission_quota), 0) AS total").
		Where("inviter_id = ? AND status IN ?", user.Id, []string{AffCommissionStatusPending, AffCommissionStatusSettled}).
		Group("status").
		Scan(&sums).Error; err != nil {
		return nil, err
	}

	var pendingQuota, settledQuota int64
	for _, row := range sums {
		switch row.Status {
		case AffCommissionStatusPending:
			pendingQuota = row.Total
		case AffCommissionStatusSettled:
			settledQuota = row.Total
		}
	}

	return &ReferralSummary{
		AffCode:               user.AffCode,
		CommissionEnabled:     common.AffCommissionEnabled,
		CommissionRate:        common.AffCommissionRate,
		CooldownDays:          common.AffCommissionCooldownDays,
		FirstTopUpDiscount:    common.InviteFirstTopUpDiscount,
		InvitedCount:          invitedCount,
		QualifiedInviteeCount: qualifiedCount,
		PendingQuota:          pendingQuota,
		SettledQuota:          settledQuota,
		TotalCommissionQuota:  pendingQuota + settledQuota,
		LegacyAffQuota:        user.AffQuota,
		LegacyAffHistoryQuota: user.AffHistoryQuota,
		ComplianceConfirmed:   operation_setting.IsPaymentComplianceConfirmed(),
	}, nil
}

func GetUserReferralCommissions(inviterId int, status string, pageInfo *common.PageInfo) ([]*ReferralCommissionItem, int64, error) {
	query := DB.Model(&AffCommission{}).Where("inviter_id = ?", inviterId)
	if status != "" {
		query = query.Where("status = ?", status)
	}

	var total int64
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	var rows []*AffCommission
	if err := query.Order("created_at DESC, id DESC").
		Limit(pageInfo.GetPageSize()).
		Offset(pageInfo.GetStartIdx()).
		Find(&rows).Error; err != nil {
		return nil, 0, err
	}

	inviteeIdSet := make(map[int]struct{}, len(rows))
	inviteeIds := make([]int, 0, len(rows))
	for _, row := range rows {
		if _, seen := inviteeIdSet[row.InviteeId]; !seen {
			inviteeIdSet[row.InviteeId] = struct{}{}
			inviteeIds = append(inviteeIds, row.InviteeId)
		}
	}

	maskedById := make(map[int]string, len(inviteeIds))
	if len(inviteeIds) > 0 {
		var invitees []User
		if err := DB.Unscoped().
			Select("id", "username", "display_name").
			Where("id IN ?", inviteeIds).
			Find(&invitees).Error; err != nil {
			return nil, 0, err
		}
		for _, u := range invitees {
			name := strings.TrimSpace(u.Username)
			if name == "" {
				name = strings.TrimSpace(u.DisplayName)
			}
			maskedById[u.Id] = MaskReferralInviteeName(name)
		}
	}

	items := make([]*ReferralCommissionItem, 0, len(rows))
	for _, row := range rows {
		masked, ok := maskedById[row.InviteeId]
		if !ok {
			masked = "*"
		}
		items = append(items, &ReferralCommissionItem{
			Id:              row.Id,
			InviteeMasked:   masked,
			TradeNo:         row.TradeNo,
			PaymentProvider: row.PaymentProvider,
			TopUpAmount:     row.TopUpAmount,
			PaidUSD:         row.PaidUSD,
			CommissionRate:  row.CommissionRate,
			CommissionQuota: row.CommissionQuota,
			Status:          row.Status,
			CancelReason:    row.CancelReason,
			CreatedAt:       row.CreatedAt,
			SettleAt:        row.SettleAt,
			SettledAt:       row.SettledAt,
		})
	}
	return items, total, nil
}
