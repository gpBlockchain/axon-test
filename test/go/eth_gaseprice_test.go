package axon

import (
	"fmt"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestGasPrice(t *testing.T) {
	clt := axonClient(axon)
	var gasPrice string
	_ = clt.Call(&gasPrice, "eth_gasPrice")
	fmt.Println(gasPrice)
	assert.Contains(t, gasPrice, "0x")

}
