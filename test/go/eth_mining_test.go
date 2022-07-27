package axon

import (
	"fmt"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestMining(t *testing.T) {
	clt := axonClient(axon)
	var stat bool
	_ = clt.Call(&stat, "eth_mining")
	fmt.Println(stat)
	assert.False(t, stat)

}
