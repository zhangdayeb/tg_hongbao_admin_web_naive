<template>
	<div class="service">
		<iframe class="service-iframe" :src="serviceInfo.value"></iframe>
	</div>
</template>

<script>
	import customerService from '@/api/Service.js'
    export default {
		props:[],
        data() {
            return {
				//客服信息
				serviceInfo: {}
            };
        },
        mounted() {
			this.getCustomerService()
        },
        methods: {
			/**
			 * 获取客服
			 * **/
			getCustomerService() {
				customerService.getService({name: 'app_webchat'}).then(res => {
                    console.log('res:',res)
					if(res.code == 1) {
						this.serviceInfo = res.data
					}
				}).catch(err => {
					console.log(err)
				})
			}
        }
    }
</script>


<style lang="scss" scoped>
	.service{
        height: 100%;
        .service-iframe{
            height: 100%;
            width: 100%;
            border: none;
        }
	}
</style>