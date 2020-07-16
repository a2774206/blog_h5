<template>
	<div>
		<!--  遮罩 -->
		<v-overlay :value="watchOverlay" @click="overlay = false">
			 <v-progress-circular
			       indeterminate
			       color="primary"
			     ></v-progress-circular>
		  </v-btn>
		</v-overlay>
		<router-view></router-view>
	</div>
 
</template>

<script>

export default {
  name: 'App',
	
  components: {
    // HelloWorld,
  },

  data: () => ({
    
  }),
  computed:{
	  watchOverlay(){
		  return this.$store.state.overlay
	  }
  },
  mounted() {
  	
  }
};
</script>
<style language="less">
	*{
		font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;
	}
	.markdown-body pre code{
		/* display: inline-block !important; */
	}
	.v-application code{
		box-shadow: none !important;
	}
	.markdown-body code{
		display: inline !important;
	}
</style>
