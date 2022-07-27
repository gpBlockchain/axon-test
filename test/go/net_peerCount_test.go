package axon

import (
	"fmt"
	"github.com/stretchr/testify/assert"
	"testing"
)

//var url = "http://localhost:8000"

func TestNetPeerCount(t *testing.T) {

	clt := axonClient("http://18.162.235.225:8000/")
	var count string
	_ = clt.Call(&count, "net_peerCount")
	fmt.Println(count)
	assert.Contains(t, count, "0x")
}
