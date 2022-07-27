package axon

import (
	"fmt"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestEthSyncing(t *testing.T) {
	clt := axonClient(axon)
	var stat bool
	_ = clt.Call(&stat, "eth_syncing")
	fmt.Println(stat)
	assert.False(t, stat)

}
