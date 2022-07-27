package axon

import (
	"fmt"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestBlockNumber(t *testing.T) {
	clt := axonClient(axon)
	var number string
	_ = clt.Call(&number, "eth_blockNumber")
	fmt.Println(number)
	assert.Contains(t, number, "0x")

}
