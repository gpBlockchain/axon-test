package axon

import (
	"fmt"
	"github.com/stretchr/testify/assert"
	"testing"
)

var axon_url = "http://localhost:8000"

func TestNetListening(t *testing.T) {
	clt := axonClient(axon_url)
	var stat bool
	_ = clt.Call(&stat, "net_listening")
	fmt.Println(stat)
	assert.True(t, stat)
}
