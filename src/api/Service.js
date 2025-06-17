import axios from '@/utils/request';

//客服 api
const customerService = {
    //获取客服地址
	getService(params) {
	 	return axios.post({url: '/config/info', data: params})	
	},
};

export default customerService;