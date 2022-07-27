package axon

import (
	"fmt"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestHashRate(t *testing.T) {
	clt := axonClient(axon)
	var hashRate string
	_ = clt.Call(&hashRate, "eth_hashrate")
	fmt.Println(hashRate)
	assert.Contains(t, hashRate, "0x")

}
