package service

import (
	"context"
	"sync"
	"sync/atomic"
	"time"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/logger"
	"github.com/QuantumNous/new-api/model"

	"github.com/bytedance/gopkg/util/gopool"
)

const (
	affCommissionSettleTickInterval = 10 * time.Minute
	affCommissionSettleBatchSize    = 200
)

var (
	affCommissionSettleOnce    sync.Once
	affCommissionSettleRunning atomic.Bool
)

// StartAffCommissionSettleTask starts the master-only periodic worker that
// settles due pending referral commissions directly into inviter wallet quota.
func StartAffCommissionSettleTask() {
	affCommissionSettleOnce.Do(func() {
		if !common.IsMasterNode {
			return
		}
		gopool.Go(func() {
			logger.LogInfo(context.Background(), common.LogText("aff commission settlement task started: tick=%s", affCommissionSettleTickInterval))
			ticker := time.NewTicker(affCommissionSettleTickInterval)
			defer ticker.Stop()

			RunAffCommissionSettleOnce()
			for range ticker.C {
				RunAffCommissionSettleOnce()
			}
		})
	})
}

func RunAffCommissionSettleOnce() {
	if !affCommissionSettleRunning.CompareAndSwap(false, true) {
		return
	}
	defer affCommissionSettleRunning.Store(false)

	ctx := context.Background()
	totalSettled := 0
	totalCancelled := 0
	for {
		fetched, settled, cancelled, err := model.SettleDueAffCommissions(affCommissionSettleBatchSize)
		if err != nil {
			logger.LogWarn(ctx, common.LogText("aff commission settlement task failed: %v", err))
			return
		}
		totalSettled += settled
		totalCancelled += cancelled
		if fetched < affCommissionSettleBatchSize || (settled == 0 && cancelled == 0) {
			break
		}
	}
	if totalSettled > 0 || totalCancelled > 0 {
		logger.LogInfo(ctx, common.LogText("aff commission settlement completed: settled=%d cancelled=%d", totalSettled, totalCancelled))
	}
}
