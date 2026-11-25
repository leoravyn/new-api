package controller

import (
	"strings"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/model"
	"github.com/gin-gonic/gin"
)

func GetReferralSummary(c *gin.Context) {
	id := c.GetInt("id")
	user, err := model.GetUserById(id, true)
	if err != nil {
		common.ApiError(c, err)
		return
	}
	if user.AffCode == "" {
		user.AffCode = common.GetRandomString(4)
		if err := user.Update(false); err != nil {
			common.ApiError(c, err)
			return
		}
	}
	summary, err := model.GetUserReferralSummary(user)
	if err != nil {
		common.ApiError(c, err)
		return
	}
	common.ApiSuccess(c, summary)
}

func GetReferralCommissions(c *gin.Context) {
	id := c.GetInt("id")
	pageInfo := common.GetPageQuery(c)
	status := strings.TrimSpace(c.Query("status"))
	if status != "" &&
		status != model.AffCommissionStatusPending &&
		status != model.AffCommissionStatusSettled &&
		status != model.AffCommissionStatusCancelled {
		common.ApiErrorT(c, "Invalid parameters")
		return
	}
	items, total, err := model.GetUserReferralCommissions(id, status, pageInfo)
	if err != nil {
		common.ApiError(c, err)
		return
	}
	pageInfo.SetTotal(int(total))
	pageInfo.SetItems(items)
	common.ApiSuccess(c, pageInfo)
}
