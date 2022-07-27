package axon

import (
	"fmt"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestCoinBase(t *testing.T) {
	clt := axonClient(axon)
	var coinbase string
	_ = clt.Call(&coinbase, "eth_coinbase")
	fmt.Println(coinbase)
	assert.Contains(t, coinbase, "0x")

}
