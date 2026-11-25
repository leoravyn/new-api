package operation_setting

import (
	"testing"

	"github.com/stretchr/testify/require"
)

func TestPaymentSettingMatchAmountDiscount(t *testing.T) {
	tiered := &PaymentSetting{
		AmountDiscount: map[int]float64{
			100: 0.95,
			200: 0.90,
		},
	}

	testCases := []struct {
		name     string
		setting  *PaymentSetting
		amount   int64
		expected float64
	}{
		{name: "exact 100 tier", setting: tiered, amount: 100, expected: 0.95},
		{name: "105 matches 100 tier", setting: tiered, amount: 105, expected: 0.95},
		{name: "199 matches 100 tier", setting: tiered, amount: 199, expected: 0.95},
		{name: "exact 200 tier", setting: tiered, amount: 200, expected: 0.90},
		{name: "250 matches 200 tier", setting: tiered, amount: 250, expected: 0.90},
		{name: "below lowest tier returns 1.0", setting: tiered, amount: 99, expected: 1.0},
		{name: "zero amount returns 1.0", setting: tiered, amount: 0, expected: 1.0},
		{name: "empty map returns 1.0", setting: &PaymentSetting{AmountDiscount: map[int]float64{}}, amount: 105, expected: 1.0},
		{name: "nil map returns 1.0", setting: &PaymentSetting{}, amount: 105, expected: 1.0},
		{name: "nil receiver returns 1.0", setting: nil, amount: 105, expected: 1.0},
		{
			name: "non-positive keys and rates are ignored",
			setting: &PaymentSetting{
				AmountDiscount: map[int]float64{
					-50: 0.5,
					0:   0.6,
					100: 0.95,
					200: 0,
					300: -0.8,
				},
			},
			amount:   350,
			expected: 0.95,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			require.InDelta(t, tc.expected, tc.setting.MatchAmountDiscount(tc.amount), 1e-9)
		})
	}
}

func TestValidateAffCommissionOption(t *testing.T) {
	testCases := []struct {
		name    string
		key     string
		value   string
		wantErr bool
	}{
		{name: "enabled true", key: "AffCommissionEnabled", value: "true"},
		{name: "enabled false", key: "AffCommissionEnabled", value: "false"},
		{name: "enabled invalid", key: "AffCommissionEnabled", value: "yes", wantErr: true},
		{name: "rate zero", key: "AffCommissionRate", value: "0"},
		{name: "rate default", key: "AffCommissionRate", value: "0.05"},
		{name: "rate one", key: "AffCommissionRate", value: "1"},
		{name: "rate negative", key: "AffCommissionRate", value: "-0.01", wantErr: true},
		{name: "rate above one", key: "AffCommissionRate", value: "1.01", wantErr: true},
		{name: "rate NaN", key: "AffCommissionRate", value: "NaN", wantErr: true},
		{name: "rate Inf", key: "AffCommissionRate", value: "Inf", wantErr: true},
		{name: "cooldown zero", key: "AffCommissionCooldownDays", value: "0"},
		{name: "cooldown default", key: "AffCommissionCooldownDays", value: "7"},
		{name: "cooldown max", key: "AffCommissionCooldownDays", value: "365"},
		{name: "cooldown negative", key: "AffCommissionCooldownDays", value: "-1", wantErr: true},
		{name: "cooldown above max", key: "AffCommissionCooldownDays", value: "366", wantErr: true},
		{name: "cooldown float", key: "AffCommissionCooldownDays", value: "7.5", wantErr: true},
		{name: "discount valid", key: "InviteFirstTopUpDiscount", value: "0.9"},
		{name: "discount disable 1.0", key: "InviteFirstTopUpDiscount", value: "1"},
		{name: "discount zero", key: "InviteFirstTopUpDiscount", value: "0", wantErr: true},
		{name: "discount negative", key: "InviteFirstTopUpDiscount", value: "-0.5", wantErr: true},
		{name: "discount above one", key: "InviteFirstTopUpDiscount", value: "1.1", wantErr: true},
		{name: "discount NaN", key: "InviteFirstTopUpDiscount", value: "NaN", wantErr: true},
		{name: "unrelated key ignored", key: "OtherOption", value: "anything"},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			err := ValidateAffCommissionOption(tc.key, tc.value)
			if tc.wantErr {
				require.Error(t, err)
			} else {
				require.NoError(t, err)
			}
		})
	}
}
