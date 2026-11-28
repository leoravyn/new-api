package service

import (
	"testing"

	"github.com/QuantumNous/new-api/setting"
	"github.com/QuantumNous/new-api/setting/ratio_setting"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestGetUserUsableGroupsExcludesUnselectableUserGroup(t *testing.T) {
	originalUsableGroups := setting.UserUsableGroups2JSONString()
	originalRatios := ratio_setting.GroupRatio2JSONString()
	originalSpecialGroups := ratio_setting.GetGroupRatioSetting().GroupSpecialUsableGroup.ReadAll()
	t.Cleanup(func() {
		require.NoError(t, setting.UpdateUserUsableGroupsByJSONString(originalUsableGroups))
		require.NoError(t, ratio_setting.UpdateGroupRatioByJSONString(originalRatios))
		specialGroups := ratio_setting.GetGroupRatioSetting().GroupSpecialUsableGroup
		specialGroups.Clear()
		specialGroups.AddAll(originalSpecialGroups)
	})

	require.NoError(t, setting.UpdateUserUsableGroupsByJSONString(`{"codex":"Codex Pro"}`))
	require.NoError(t, ratio_setting.UpdateGroupRatioByJSONString(`{"default":1,"vip":1,"premium":1,"codex":0.18}`))
	specialGroups := ratio_setting.GetGroupRatioSetting().GroupSpecialUsableGroup
	specialGroups.Clear()

	for _, userGroup := range []string{"default", "vip", "premium"} {
		usable := GetUserUsableGroups(userGroup)
		assert.Equal(t, map[string]string{"codex": "Codex Pro"}, usable)
		assert.False(t, IsUserSelectableGroup(userGroup, userGroup))
		assert.True(t, IsUserSelectableGroup(userGroup, "codex"))
	}

	specialGroups.Set("vip", map[string]string{
		"+:vip":     "VIP",
		"-:codex":   "",
	})
	assert.Equal(t, map[string]string{"vip": "VIP"}, GetUserUsableGroups("vip"))
}
