// ws模块
import { defineStore } from "pinia";
import { ref } from "vue";

// 创建仓库
const useWebSocketStore = defineStore("webSocket", () => {
  const socketUrl = ref('')
  const isCloseWebsocket = ref(false)
  const running = ref(false)
  const socket = ref<WebSocket | null>(null)
  const timer = ref<ReturnType<typeof setInterval> | null>(null)

  const tableData = ref([])

  const getData = (data: any) => {
    // todo
    console.log(data)
  }

  const getWebSocket = () => {
    if (!socketUrl.value) {
      return;
    }
    socket.value = new WebSocket(socketUrl.value)

    socket.value.onopen = () => {
      console.log("webSocket onopen")
      running.value = true
    }

    socket.value.onmessage = (event) => {
      // console.log("webSocket onmsg")
      const data = event.data === 'pong' ? undefined : JSON.parse(event.data)
      if (data) {
        getData(data)
      }
    }

    socket.value.onclose = () => {
      console.log("webSocket onclose")
      running.value = false
      if (!isCloseWebsocket.value) {
        setTimeout(() => {
          getWebSocket()
        }, 5000);
      } else {
        isCloseWebsocket.value = false
      }
    }

    socket.value.onerror = () => {
      console.log("webSocket onerror")
      running.value = false
      if (!isCloseWebsocket.value) {
        setTimeout(() => {
          getWebSocket()
        }, 5000);
      } else {
        isCloseWebsocket.value = false
      }
    }

    timer.value = setInterval(() => {
      if (!running.value) {
        return;
      }
      socket.value?.send('ping')
    }, 10000);
  }

  // 可使用import.meta.env.VITE_APP_SOCKET_HOST对路径进行拼接分环境
  const startWebSocket = (url: string) => {
    socketUrl.value = url
    getWebSocket()
  }

  const stopWebSocket = () => {
    isCloseWebsocket.value = true
    if (socket.value) {
      socket.value.close()
      socket.value = null
    }
    running.value = false
    if (timer.value) {
      clearInterval(timer.value)
      timer.value = null
    }
    socketUrl.value = ""
    tableData.value = []
  }

  return {
    startWebSocket,
    stopWebSocket,
    tableData,
  }
})

export default useWebSocketStore;