<template>
  <div class='page-content'>
    <!-- 搜索区域 -->
    <div class="search-section">
      <el-form label-width="100px">
        <!-- 第一行搜索条件 -->
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :lg="6">
            <el-form-item label="支付方式：">
              <el-select v-model="searchForm.methodCode" clearable placeholder="请选择支付方式" style="width: 100%">
                <el-option 
                  v-for="method in paymentMethods" 
                  :key="method.code" 
                  :label="method.name" 
                  :value="method.code">
                  <i :class="method.icon" :style="`color: ${getMethodColor(method.code)}; margin-right: 8px;`"></i>
                  {{ method.name }}
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="6">
            <el-form-item label="账户状态：">
              <el-select v-model="searchForm.isActive" clearable placeholder="请选择状态" style="width: 100%">
                <el-option label="启用" :value="1"></el-option>
                <el-option label="禁用" :value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="6">
            <el-form-item label="账户名称：">
              <el-input v-model="searchForm.accountName" placeholder="请输入账户名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="6">
            <el-form-item label="创建时间：">
              <el-date-picker
                v-model="searchForm.dateRange"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        
        <!-- 第二行操作按钮 -->
        <el-row :gutter="20">
          <el-col :span="24" style="text-align: right;">
            <el-button type="primary" @click="handleSearch">
              <i class="el-icon-search"></i> 搜索
            </el-button>
            <el-button @click="handleReset">
              <i class="el-icon-refresh"></i> 重置
            </el-button>
            <el-button type="success" @click="showAddDialog">
              <i class="el-icon-plus"></i> 添加账户
            </el-button>
            <el-button type="info" plain @click="handleExport">
              <i class="el-icon-download"></i> 导出
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    
    <!-- 统计信息 -->
    <div class="statistics-section" v-if="statistics">
      <el-row :gutter="20">
        <el-col :xs="12" :sm="8" :lg="4">
          <div class="stat-card total">
            <div class="stat-icon">
              <i class="el-icon-s-data"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ statistics.totalCount }}</div>
              <div class="stat-label">总账户数</div>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="8" :lg="4">
          <div class="stat-card aba">
            <div class="stat-icon">
              <i class="el-icon-bank-card"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ statistics.abaCount }}</div>
              <div class="stat-label">ABA银行</div>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="8" :lg="4">
          <div class="stat-card huiwang">
            <div class="stat-icon">
              <i class="el-icon-mobile"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ statistics.huiwangCount }}</div>
              <div class="stat-label">汇旺支付</div>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="8" :lg="4">
          <div class="stat-card usdt">
            <div class="stat-icon">
              <i class="el-icon-coin"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ statistics.usdtCount }}</div>
              <div class="stat-label">USDT钱包</div>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="8" :lg="4">
          <div class="stat-card active">
            <div class="stat-icon">
              <i class="el-icon-check"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ statistics.activeCount }}</div>
              <div class="stat-label">启用账户</div>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="8" :lg="4">
          <div class="stat-card limit">
            <div class="stat-icon">
              <i class="el-icon-money"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">${{ statistics.totalDailyLimit }}</div>
              <div class="stat-label">总日限额</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    
    <!-- 操作按钮区域 -->
    <div class="action-section">
      <el-button type="primary" plain @click="handleBatchEnable" :disabled="!selectedRows.length">
        <i class="el-icon-check"></i> 批量启用
      </el-button>
      <el-button type="warning" plain @click="handleBatchDisable" :disabled="!selectedRows.length">
        <i class="el-icon-close"></i> 批量禁用
      </el-button>
      <el-button @click="handleRefresh">
        <i class="el-icon-refresh"></i> 刷新
      </el-button>
      <span style="margin-left: 10px; color: #909399;">
        已选择 {{ selectedRows.length }} 个账户
      </span>
    </div>
    
    <!-- 数据表格 -->
    <el-table 
      :data="accountList" 
      border 
      style="margin-top: 15px"
      @selection-change="handleSelectionChange"
      v-loading="loading"
      ref="table">
      
      <!-- 选择列 -->
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      
      <!-- 支付方式 -->
      <el-table-column label="支付方式" width="120">
        <template slot-scope="scope">
          <div class="payment-method">
            <el-tag :type="getMethodTagType(scope.row.methodCode)" size="medium">
              <i :class="getMethodIcon(scope.row.methodCode)"></i>
              {{ getMethodName(scope.row.methodCode) }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      
      <!-- 账户信息 -->
      <el-table-column label="账户信息" min-width="200">
        <template slot-scope="scope">
          <div class="account-info">
            <div class="account-name">{{ scope.row.accountName }}</div>
            <div class="account-detail" v-if="scope.row.methodCode === 'aba'">
              <span class="label">账号:</span> {{ scope.row.accountNumber }}
            </div>
            <div class="account-detail" v-else-if="scope.row.methodCode === 'huiwang'">
              <span class="label">汇旺号:</span> {{ scope.row.accountNumber }}
            </div>
            <div class="account-detail" v-else-if="scope.row.methodCode === 'usdt'">
              <span class="label">地址:</span> 
              <span class="wallet-address">{{ formatWalletAddress(scope.row.walletAddress) }}</span>
              <el-button type="text" size="mini" @click="copyToClipboard(scope.row.walletAddress)">
                <i class="el-icon-copy-document"></i>
              </el-button>
            </div>
          </div>
        </template>
      </el-table-column>
      
      <!-- 银行/网络信息 -->
      <el-table-column label="银行/网络" width="160">
        <template slot-scope="scope">
          <div v-if="scope.row.methodCode === 'aba'">
            <div class="bank-name">{{ scope.row.bankName }}</div>
          </div>
          <div v-else-if="scope.row.methodCode === 'usdt'">
            <el-tag size="mini" type="success">{{ scope.row.networkType }}</el-tag>
          </div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      
      <!-- 联系方式 -->
      <el-table-column label="联系方式" width="130">
        <template slot-scope="scope">
          <span v-if="scope.row.phoneNumber">{{ scope.row.phoneNumber }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      
      <!-- 限额设置 -->
      <el-table-column label="日限额" width="120">
        <template slot-scope="scope">
          <div class="limit-info">
            <span class="limit-amount">${{ formatNumber(scope.row.dailyLimit) }}</span>
          </div>
        </template>
      </el-table-column>
      
      <!-- 使用统计 -->
      <el-table-column label="使用统计" width="140">
        <template slot-scope="scope">
          <div class="usage-info">
            <div class="usage-count">使用 {{ scope.row.usageCount }} 次</div>
            <div class="last-used" v-if="scope.row.lastUsedAt">
              {{ formatLastUsed(scope.row.lastUsedAt) }}
            </div>
            <div class="last-used" v-else>从未使用</div>
          </div>
        </template>
      </el-table-column>
      
      <!-- 状态 -->
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isActive"
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="禁用"
            @change="handleStatusChange(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      
      <!-- 创建时间 -->
      <el-table-column label="创建时间" prop="createdAt" width="160">
        <template slot-scope="scope">
          {{ formatDateTime(scope.row.createdAt) }}
        </template>
      </el-table-column>
      
      <!-- 操作列 -->
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-view" @click="showDetail(scope.row)">
            详情
          </el-button>
          <el-button type="text" icon="el-icon-edit" @click="showEditDialog(scope.row)">
            编辑
          </el-button>
          <el-button 
            v-if="scope.row.methodCode === 'usdt' && scope.row.qrCodeUrl"
            type="text" 
            icon="el-icon-picture" 
            @click="showQRCode(scope.row)">
            二维码
          </el-button>
          <el-button type="text" icon="el-icon-delete" style="color: #F56C6C" @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <template v-if="totalCount > 0">
      <el-pagination 
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        style="margin-top: 20px; text-align: right;">
      </el-pagination>
    </template>

    <!-- 添加/编辑账户对话框 -->
    <el-dialog 
      :title="editDialog.isEdit ? '编辑账户' : '添加账户'" 
      width="600px" 
      :visible.sync="editDialog.visible"
      @close="resetEditForm">
      
      <el-form :model="editForm" :rules="editRules" ref="editForm" label-width="120px">
        <!-- 支付方式选择 -->
        <el-form-item label="支付方式" prop="methodCode">
          <el-select 
            v-model="editForm.methodCode" 
            placeholder="请选择支付方式" 
            style="width: 100%"
            :disabled="editDialog.isEdit"
            @change="handleMethodChange">
            <el-option 
              v-for="method in paymentMethods" 
              :key="method.code" 
              :label="method.name" 
              :value="method.code">
              <i :class="method.icon" :style="`color: ${getMethodColor(method.code)}; margin-right: 8px;`"></i>
              {{ method.name }}
            </el-option>
          </el-select>
        </el-form-item>

        <!-- 通用字段 -->
        <el-form-item label="账户名称" prop="accountName">
          <el-input v-model="editForm.accountName" placeholder="请输入账户名称"></el-input>
        </el-form-item>

        <!-- ABA银行专用字段 -->
        <template v-if="editForm.methodCode === 'aba'">
          <el-form-item label="银行名称" prop="bankName">
            <el-input v-model="editForm.bankName" placeholder="请输入银行名称"></el-input>
          </el-form-item>
          <el-form-item label="账户号码" prop="accountNumber">
            <el-input v-model="editForm.accountNumber" placeholder="请输入银行账户号码"></el-input>
          </el-form-item>
        </template>

        <!-- 汇旺专用字段 -->
        <template v-if="editForm.methodCode === 'huiwang'">
          <el-form-item label="汇旺账号" prop="accountNumber">
            <el-input v-model="editForm.accountNumber" placeholder="请输入汇旺账号"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="phoneNumber">
            <el-input v-model="editForm.phoneNumber" placeholder="请输入手机号码"></el-input>
          </el-form-item>
        </template>

        <!-- USDT专用字段 -->
        <template v-if="editForm.methodCode === 'usdt'">
          <el-form-item label="钱包地址" prop="walletAddress">
            <el-input v-model="editForm.walletAddress" placeholder="请输入USDT钱包地址"></el-input>
          </el-form-item>
          <el-form-item label="网络类型" prop="networkType">
            <el-select v-model="editForm.networkType" placeholder="请选择网络类型" style="width: 100%">
              <el-option 
                v-for="network in usdtNetworks" 
                :key="network" 
                :label="network" 
                :value="network">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="二维码上传">
            <el-upload
              class="qr-uploader"
              :action="uploadQRCodeUrl"
              name="file"
              :headers="uploadHeaders"
              :data="uploadData"
              :show-file-list="false"
              :on-success="handleQRSuccess"
              :on-error="handleQRError"
              :on-progress="handleQRProgress"
              :before-upload="beforeQRUpload"
              accept=".jpg,.jpeg,.png,.gif,.bmp">
              
              <img v-if="editForm.qrCodeUrl" :src="editForm.qrCodeUrl" class="qr-image">
              <div v-else class="qr-uploader-placeholder">
                <i class="el-icon-plus qr-uploader-icon"></i>
                <div class="upload-text">点击上传二维码</div>
              </div>
            </el-upload>
            
            <!-- 上传提示 -->
            <div class="upload-tip">
              <span class="tip-text">支持 JPG、PNG、GIF、BMP 格式，文件大小不超过 2MB</span>
            </div>
          </el-form-item>
        </template>

        <!-- 通用设置 -->
        <el-form-item label="日限额" prop="dailyLimit">
          <el-input-number 
            v-model="editForm.dailyLimit" 
            :min="0" 
            :max="1000000"
            :precision="2"
            placeholder="请输入日限额"
            style="width: 100%">
          </el-input-number>
        </el-form-item>

        <el-form-item label="账户状态">
          <el-switch
            v-model="editForm.isActive"
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="禁用">
          </el-switch>
        </el-form-item>

        <el-form-item label="备注信息">
          <el-input 
            v-model="editForm.remark" 
            type="textarea" 
            rows="3" 
            placeholder="请输入备注信息">
          </el-input>
        </el-form-item>
      </el-form>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="handleSave" :loading="editDialog.loading">
          {{ editDialog.isEdit ? '保存' : '添加' }}
        </el-button>
      </span>
    </el-dialog>

    <!-- 账户详情对话框 -->
    <el-dialog title="账户详情" width="700px" :visible.sync="detailDialog.visible">
      <el-descriptions :column="2" border v-if="detailDialog.data">
        <el-descriptions-item label="支付方式">
          <el-tag :type="getMethodTagType(detailDialog.data.methodCode)">
            <i :class="getMethodIcon(detailDialog.data.methodCode)"></i>
            {{ getMethodName(detailDialog.data.methodCode) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="账户名称">{{ detailDialog.data.accountName }}</el-descriptions-item>
        
        <el-descriptions-item label="账户号码" v-if="detailDialog.data.accountNumber">
          {{ detailDialog.data.accountNumber }}
        </el-descriptions-item>
        <el-descriptions-item label="银行名称" v-if="detailDialog.data.bankName">
          {{ detailDialog.data.bankName }}
        </el-descriptions-item>
        <el-descriptions-item label="手机号码" v-if="detailDialog.data.phoneNumber">
          {{ detailDialog.data.phoneNumber }}
        </el-descriptions-item>
        <el-descriptions-item label="钱包地址" v-if="detailDialog.data.walletAddress" span="2">
          <span class="wallet-address-full">{{ detailDialog.data.walletAddress }}</span>
          <el-button type="text" size="mini" @click="copyToClipboard(detailDialog.data.walletAddress)">
            <i class="el-icon-copy-document"></i> 复制
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item label="网络类型" v-if="detailDialog.data.networkType">
          <el-tag size="small" type="success">{{ detailDialog.data.networkType }}</el-tag>
        </el-descriptions-item>
        
        <el-descriptions-item label="日限额">${{ formatNumber(detailDialog.data.dailyLimit) }}</el-descriptions-item>
        <el-descriptions-item label="余额限制">
          {{ detailDialog.data.balanceLimit ? '$' + formatNumber(detailDialog.data.balanceLimit) : '无限制' }}
        </el-descriptions-item>
        <el-descriptions-item label="使用次数">{{ detailDialog.data.usageCount }} 次</el-descriptions-item>
        <el-descriptions-item label="最后使用">
          {{ detailDialog.data.lastUsedAt ? formatDateTime(detailDialog.data.lastUsedAt) : '从未使用' }}
        </el-descriptions-item>
        <el-descriptions-item label="账户状态">
          <el-tag :type="detailDialog.data.isActive ? 'success' : 'danger'">
            {{ detailDialog.data.isActive ? '启用' : '禁用' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ formatDateTime(detailDialog.data.createdAt) }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ formatDateTime(detailDialog.data.updatedAt) }}</el-descriptions-item>
        <el-descriptions-item label="备注信息" span="2">{{ detailDialog.data.remark || '无' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <!-- 二维码预览对话框 -->
    <el-dialog title="二维码预览" width="400px" :visible.sync="qrDialog.visible">
      <div class="qr-preview" v-if="qrDialog.imageUrl">
        <img :src="qrDialog.imageUrl" alt="二维码" class="qr-preview-image">
        <div class="qr-info">
          <p><strong>钱包地址:</strong></p>
          <p class="wallet-address-full">{{ qrDialog.walletAddress }}</p>
          <el-button type="primary" size="small" @click="copyToClipboard(qrDialog.walletAddress)">
            <i class="el-icon-copy-document"></i> 复制地址
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDepositAccountListApi,
  getDepositAccountDetailApi,
  addDepositAccountApi,
  updateDepositAccountApi,
  deleteDepositAccountApi,
  toggleDepositAccountStatusApi,
  batchToggleDepositAccountStatusApi,
  getDepositAccountStatisticsApi,
  exportDepositAccountsApi,
  getPaymentMethodsConfigApi,
  updateAccountUsageApi
} from '@/api/ZhangHuApi'
import { baseUrl } from '@/utils/config'
import { getToken } from '@/utils/auth'

export default {
  name: 'DepositAccountManagement',
  data() {
    return {
      loading: false,
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      
      // 搜索表单
      searchForm: {
        methodCode: '',
        isActive: '',
        accountName: '',
        dateRange: []
      },
      
      // 选中的行
      selectedRows: [],
      
      // 账户列表
      accountList: [],
      
      // 统计数据
      statistics: null,
      
      // 支付方式配置
      paymentMethods: [],
      
      // USDT网络类型
      usdtNetworks: ['TRC20', 'ERC20', 'BSC'],
      
      // 上传配置
      uploadQRCodeUrl: baseUrl + '/upload/qrcode',
      uploadHeaders: {
        'Authorization': 'Bearer ' + getToken(),
        'X-Requested-With': 'XMLHttpRequest'
      },
      uploadData: {
        type: 'qrcode'
      },
      
      // 编辑对话框
      editDialog: {
        visible: false,
        loading: false,
        isEdit: false
      },
      
      // 编辑表单
      editForm: {
        id: null,
        methodCode: '',
        accountName: '',
        accountNumber: '',
        bankName: '',
        phoneNumber: '',
        walletAddress: '',
        networkType: '',
        qrCodeUrl: '',
        isActive: 1,
        dailyLimit: null,
        balanceLimit: null,
        remark: ''
      },
      
      // 表单验证规则
      editRules: {
        methodCode: [
          { required: true, message: '请选择支付方式', trigger: 'change' }
        ],
        accountName: [
          { required: true, message: '请输入账户名称', trigger: 'blur' }
        ],
        accountNumber: [
          { required: true, message: '请输入账户号码', trigger: 'blur' }
        ],
        bankName: [
          { required: true, message: '请输入银行名称', trigger: 'blur' }
        ],
        phoneNumber: [
          { required: true, message: '请输入手机号码', trigger: 'blur' }
        ],
        walletAddress: [
          { required: true, message: '请输入钱包地址', trigger: 'blur' }
        ],
        networkType: [
          { required: true, message: '请选择网络类型', trigger: 'change' }
        ],
        dailyLimit: [
          { required: true, message: '请输入日限额', trigger: 'blur' }
        ]
      },
      
      // 详情对话框
      detailDialog: {
        visible: false,
        data: {}
      },
      
      // 二维码对话框
      qrDialog: {
        visible: false,
        imageUrl: '',
        walletAddress: ''
      }
    };
  },
  
  mounted() {
    this.loadPaymentMethods();
    this.loadData();
    this.loadStatistics();
  },
  
  methods: {
    // 加载支付方式配置
    async loadPaymentMethods() {
      try {
        const res = await getPaymentMethodsConfigApi();
        if (res.code === 1) {
          this.paymentMethods = res.data || [];
          // 获取USDT网络类型
          const usdtMethod = this.paymentMethods.find(m => m.code === 'usdt');
          if (usdtMethod && usdtMethod.networks) {
            this.usdtNetworks = usdtMethod.networks;
          }
        }
      } catch (error) {
        console.error('加载支付方式失败:', error);
      }
    },
    
    // 加载数据
    async loadData() {
      this.loading = true;
      try {
        const params = this.buildQueryParams();
        const res = await getDepositAccountListApi(params);
        
        if (res.code === 1) {
          this.accountList = res.data.data || [];
          this.totalCount = parseInt(res.data.total) || 0;
          this.currentPage = parseInt(res.data.current_page) || 1;
          this.pageSize = parseInt(res.data.per_page) || 10;
        } else {
          this.$message.error(res.message || '获取数据失败');
        }
      } catch (error) {
        console.error('加载数据失败:', error);
        this.$message.error('网络错误，请稍后重试');
      } finally {
        this.loading = false;
      }
    },
    
    // 加载统计数据
    async loadStatistics() {
      try {
        const params = this.buildStatisticsParams();
        const res = await getDepositAccountStatisticsApi(params);
        
        if (res.code === 1) {
          this.statistics = res.data;
        }
      } catch (error) {
        console.error('加载统计数据失败:', error);
      }
    },
    
    // 构建查询参数
    buildQueryParams() {
      const params = {
        page: parseInt(this.currentPage),
        limit: parseInt(this.pageSize)
      };

      // 添加搜索条件
      if (this.searchForm.methodCode) params.methodCode = this.searchForm.methodCode;
      if (this.searchForm.isActive !== '') params.isActive = parseInt(this.searchForm.isActive);
      if (this.searchForm.accountName) params.accountName = this.searchForm.accountName;

      // 处理时间范围
      if (this.searchForm.dateRange && this.searchForm.dateRange.length === 2) {
        params.start = this.searchForm.dateRange[0];
        params.end = this.searchForm.dateRange[1];
      }

      return params;
    },
    
    // 构建统计参数
    buildStatisticsParams() {
      const params = {};
      
      if (this.searchForm.methodCode) params.methodCode = this.searchForm.methodCode;
      if (this.searchForm.isActive !== '') params.isActive = parseInt(this.searchForm.isActive);
      if (this.searchForm.dateRange && this.searchForm.dateRange.length === 2) {
        params.start = this.searchForm.dateRange[0];
        params.end = this.searchForm.dateRange[1];
      }

      return params;
    },
    
    // 分页处理
    handleCurrentChange(page) {
      this.currentPage = parseInt(page);
      this.loadData();
    },

    handleSizeChange(size) {
      this.pageSize = parseInt(size);
      this.currentPage = 1;
      this.loadData();
    },
    
    // 搜索
    handleSearch() {
      this.currentPage = 1;
      this.loadData();
      this.loadStatistics();
    },
    
    // 重置
    handleReset() {
      this.searchForm = {
        methodCode: '',
        isActive: '',
        accountName: '',
        dateRange: []
      };
      this.currentPage = 1;
      this.loadData();
      this.loadStatistics();
    },
    
    // 导出
    async handleExport() {
      try {
        const params = this.buildQueryParams();
        delete params.page;
        delete params.limit;
        
        const res = await exportDepositAccountsApi(params);
        if (res.code === 1) {
          this.$message.success('导出成功');
          if (res.data.downloadUrl) {
            window.open(res.data.downloadUrl);
          }
        } else {
          this.$message.error(res.message || '导出失败');
        }
      } catch (error) {
        console.error('导出失败:', error);
        this.$message.error('导出失败，请稍后重试');
      }
    },
    
    // 刷新
    handleRefresh() {
      this.loadData();
      this.loadStatistics();
    },
    
    // 选择变化
    handleSelectionChange(selection) {
      this.selectedRows = selection;
    },
    
    // 批量启用
    handleBatchEnable() {
      if (this.selectedRows.length === 0) return;
      this.$confirm(`确定要启用选中的 ${this.selectedRows.length} 个账户吗？`, '确认操作', {
        type: 'warning'
      }).then(async () => {
        try {
          const ids = this.selectedRows.map(row => row.id);
          const res = await batchToggleDepositAccountStatusApi({ ids, isActive: 1 });
          
          if (res.code === 1) {
            this.$message.success(res.message);
            this.selectedRows = [];
            this.loadData();
            this.loadStatistics();
          } else {
            this.$message.error(res.message || '批量启用失败');
          }
        } catch (error) {
          console.error('批量启用失败:', error);
          this.$message.error('操作失败，请稍后重试');
        }
      });
    },
    
    // 批量禁用
    handleBatchDisable() {
      if (this.selectedRows.length === 0) return;
      this.$confirm(`确定要禁用选中的 ${this.selectedRows.length} 个账户吗？`, '确认操作', {
        type: 'warning'
      }).then(async () => {
        try {
          const ids = this.selectedRows.map(row => row.id);
          const res = await batchToggleDepositAccountStatusApi({ ids, isActive: 0 });
          
          if (res.code === 1) {
            this.$message.success(res.message);
            this.selectedRows = [];
            this.loadData();
            this.loadStatistics();
          } else {
            this.$message.error(res.message || '批量禁用失败');
          }
        } catch (error) {
          console.error('批量禁用失败:', error);
          this.$message.error('操作失败，请稍后重试');
        }
      });
    },
    
    // 状态切换
    async handleStatusChange(row) {
      const status = row.isActive ? '启用' : '禁用';
      
      try {
        const res = await toggleDepositAccountStatusApi({
          id: row.id,
          isActive: row.isActive
        });
        
        if (res.code === 1) {
          this.$message.success(res.message);
          this.loadStatistics();
        } else {
          this.$message.error(res.message || `${status}失败`);
          // 恢复原状态
          row.isActive = row.isActive ? 0 : 1;
        }
      } catch (error) {
        console.error('切换状态失败:', error);
        this.$message.error('操作失败，请稍后重试');
        // 恢复原状态
        row.isActive = row.isActive ? 0 : 1;
      }
    },
    
    // 显示添加对话框
    showAddDialog() {
      this.editDialog.isEdit = false;
      this.editDialog.visible = true;
      this.resetEditForm();
    },
    
    // 显示编辑对话框
    showEditDialog(row) {
      this.editDialog.isEdit = true;
      this.editDialog.visible = true;
      this.editForm = { ...row };
    },
    
    // 显示详情
    async showDetail(row) {
      try {
        const res = await getDepositAccountDetailApi({ id: row.id });
        if (res.code === 1) {
          this.detailDialog.data = res.data;
          this.detailDialog.visible = true;
        } else {
          this.$message.error(res.message || '获取详情失败');
        }
      } catch (error) {
        console.error('获取详情失败:', error);
        this.$message.error('获取详情失败，请稍后重试');
      }
    },
    
    // 显示二维码
    showQRCode(row) {
      this.qrDialog.imageUrl = row.qrCodeUrl;
      this.qrDialog.walletAddress = row.walletAddress;
      this.qrDialog.visible = true;
    },
    
    // 删除账户
    handleDelete(row) {
      this.$confirm(`确定要删除账户"${row.accountName}"吗？此操作不可恢复！`, '确认删除', {
        type: 'error'
      }).then(async () => {
        try {
          const res = await deleteDepositAccountApi({ id: row.id });
          if (res.code === 1) {
            this.$message.success(res.message);
            this.loadData();
            this.loadStatistics();
          } else {
            this.$message.error(res.message || '删除失败');
          }
        } catch (error) {
          console.error('删除失败:', error);
          this.$message.error('操作失败，请稍后重试');
        }
      });
    },
    
    // 支付方式变化
    handleMethodChange(value) {
      // 清空其他字段
      this.editForm.accountNumber = '';
      this.editForm.bankName = '';
      this.editForm.phoneNumber = '';
      this.editForm.walletAddress = '';
      this.editForm.networkType = '';
      this.editForm.qrCodeUrl = '';
    },
    
    // 保存
    handleSave() {
      this.$refs.editForm.validate(async (valid) => {
        if (!valid) return;
        
        this.editDialog.loading = true;
        
        try {
          let res;
          if (this.editDialog.isEdit) {
            res = await updateDepositAccountApi(this.editForm);
          } else {
            res = await addDepositAccountApi(this.editForm);
          }
          
          if (res.code === 1) {
            this.$message.success(res.message);
            this.editDialog.visible = false;
            this.loadData();
            this.loadStatistics();
          } else {
            this.$message.error(res.message || '操作失败');
          }
        } catch (error) {
          console.error('保存失败:', error);
          this.$message.error('操作失败，请稍后重试');
        } finally {
          this.editDialog.loading = false;
        }
      });
    },
    
    // 重置编辑表单
    resetEditForm() {
      this.editForm = {
        id: null,
        methodCode: '',
        accountName: '',
        accountNumber: '',
        bankName: '',
        phoneNumber: '',
        walletAddress: '',
        networkType: '',
        qrCodeUrl: '',
        isActive: 1,
        dailyLimit: null,
        balanceLimit: null,
        remark: ''
      };
      if (this.$refs.editForm) {
        this.$refs.editForm.clearValidate();
      }
    },
    
    // 二维码上传成功
    handleQRSuccess(res, file) {
      console.log('上传响应:', res);
      
      // 根据后端返回的数据结构处理
      if (res.code === 1) {
        this.editForm.qrCodeUrl = res.data.url;
        this.$message.success('二维码上传成功');
      } else {
        this.$message.error(res.message || '上传失败');
      }
    },
    
    // 二维码上传前验证
    beforeQRUpload(file) {
      // 检查文件类型
      const isImage = file.type.indexOf('image/') === 0;
      if (!isImage) {
        this.$message.error('只能上传图片文件!');
        return false;
      }

      // 检查文件大小 (2MB)
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 2MB!');
        return false;
      }

      // 检查图片格式
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp'];
      if (!allowedTypes.includes(file.type)) {
        this.$message.error('只支持 JPG、PNG、GIF、BMP 格式的图片!');
        return false;
      }

      return true;
    },
    
    // 上传错误处理
    handleQRError(err, file, fileList) {
      console.error('上传失败:', err);
      this.$message.error('上传失败，请重试');
    },
    
    // 上传进度处理
    handleQRProgress(event, file, fileList) {
      console.log('上传进度:', Math.round(event.percent) + '%');
    },
    
    // 复制到剪贴板
    copyToClipboard(text) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          this.$message.success('已复制到剪贴板');
        });
      } else {
        // 兼容性处理
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        this.$message.success('已复制到剪贴板');
      }
    },
    
    // 获取支付方式名称
    getMethodName(methodCode) {
      const method = this.paymentMethods.find(m => m.code === methodCode);
      return method ? method.name : methodCode;
    },
    
    // 获取支付方式图标
    getMethodIcon(methodCode) {
      const method = this.paymentMethods.find(m => m.code === methodCode);
      return method ? method.icon : 'el-icon-s-finance';
    },
    
    // 获取支付方式颜色
    getMethodColor(methodCode) {
      const colors = {
        'aba': '#409EFF',
        'huiwang': '#E6A23C',
        'usdt': '#67C23A'
      };
      return colors[methodCode] || '#909399';
    },
    
    // 获取支付方式标签类型
    getMethodTagType(methodCode) {
      const types = {
        'aba': 'primary',
        'huiwang': 'warning',
        'usdt': 'success'
      };
      return types[methodCode] || 'info';
    },
    
    // 格式化钱包地址
    formatWalletAddress(address) {
      if (!address) return '';
      if (address.length <= 20) return address;
      return address.substring(0, 10) + '...' + address.substring(address.length - 10);
    },
    
    // 格式化数字
    formatNumber(num) {
      if (!num) return '0.00';
      return parseFloat(num).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    },
    
    // 格式化最后使用时间
    formatLastUsed(datetime) {
      if (!datetime) return '';
      const date = new Date(datetime);
      const now = new Date();
      const diff = now - date;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      
      if (days === 0) return '今天';
      if (days === 1) return '昨天';
      if (days < 7) return `${days}天前`;
      return this.formatDateTime(datetime);
    },
    
    // 格式化日期时间
    formatDateTime(datetime) {
      if (!datetime) return '-';
      return datetime.replace('T', ' ').substring(0, 19);
    }
  }
}
</script>

<style lang='scss' scoped>
.page-content {
  width: 100%;
  height: 100%;
  
  .search-section {
    background: #fff;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  }
  
  .statistics-section {
    background: #fff;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.1);
    
    .stat-card {
      display: flex;
      align-items: center;
      padding: 20px;
      border-radius: 8px;
      color: white;
      position: relative;
      overflow: hidden;
      
      &.total {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      
      &.aba {
        background: linear-gradient(135deg, #409EFF 0%, #5dade2 100%);
      }
      
      &.huiwang {
        background: linear-gradient(135deg, #E6A23C 0%, #f39c12 100%);
      }
      
      &.usdt {
        background: linear-gradient(135deg, #67C23A 0%, #2ecc71 100%);
      }
      
      &.active {
        background: linear-gradient(135deg, #67C23A 0%, #27ae60 100%);
      }
      
      &.limit {
        background: linear-gradient(135deg, #909399 0%, #7f8c8d 100%);
      }
      
      .stat-icon {
        font-size: 40px;
        margin-right: 15px;
        opacity: 0.8;
      }
      
      .stat-content {
        flex: 1;
        
        .stat-value {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 4px;
        }
        
        .stat-label {
          font-size: 14px;
          opacity: 0.9;
        }
      }
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 100px;
        height: 100px;
        background: rgba(255,255,255,0.1);
        border-radius: 50%;
        transform: translate(30px, -30px);
      }
    }
  }
  
  .action-section {
    margin-bottom: 15px;
    padding: 10px 0;
  }
  
  .payment-method {
    .el-tag {
      i {
        margin-right: 4px;
      }
    }
  }
  
  .account-info {
    .account-name {
      font-weight: bold;
      color: #303133;
      margin-bottom: 4px;
    }
    
    .account-detail {
      font-size: 12px;
      color: #606266;
      margin-bottom: 2px;
      
      .label {
        color: #909399;
        margin-right: 4px;
      }
      
      .wallet-address {
        font-family: 'Courier New', monospace;
        color: #67C23A;
      }
    }
  }
  
  .bank-name {
    font-size: 13px;
    color: #606266;
  }
  
  .limit-info {
    .limit-amount {
      font-weight: bold;
      color: #E6A23C;
    }
  }
  
  .usage-info {
    .usage-count {
      font-size: 13px;
      color: #303133;
      margin-bottom: 2px;
    }
    
    .last-used {
      font-size: 11px;
      color: #909399;
    }
  }
  
  // 二维码上传样式
  .qr-uploader {
    :deep(.el-upload) {
      border: 2px dashed #d9d9d9;
      border-radius: 8px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      width: 148px;
      height: 148px;
      transition: border-color 0.3s;
      
      &:hover {
        border-color: #409EFF;
      }
    }
    
    .qr-uploader-placeholder {
      width: 148px;
      height: 148px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #fafafa;
    }
    
    .qr-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      margin-bottom: 8px;
    }
    
    .upload-text {
      font-size: 12px;
      color: #8c939d;
    }
    
    .qr-image {
      width: 148px;
      height: 148px;
      display: block;
      object-fit: cover;
    }
  }
  
  .upload-tip {
    margin-top: 8px;
    
    .tip-text {
      font-size: 12px;
      color: #909399;
      line-height: 1.4;
    }
  }
  
  // 二维码预览样式
  .qr-preview {
    text-align: center;
    
    .qr-preview-image {
      width: 200px;
      height: 200px;
      margin-bottom: 20px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    .qr-info {
      p {
        margin: 10px 0;
      }
      
      .wallet-address-full {
        font-family: 'Courier New', monospace;
        color: #67C23A;
        background: #f5f7fa;
        padding: 8px;
        border-radius: 4px;
        word-break: break-all;
        font-size: 12px;
      }
    }
  }
  
  // 详情对话框中的钱包地址
  .wallet-address-full {
    font-family: 'Courier New', monospace;
    color: #67C23A;
    background: #f5f7fa;
    padding: 4px 8px;
    border-radius: 4px;
    word-break: break-all;
    font-size: 12px;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .page-content {
    .statistics-section {
      .stat-card {
        margin-bottom: 10px;
        padding: 15px;
        
        .stat-icon {
          font-size: 28px;
          margin-right: 10px;
        }
        
        .stat-content .stat-value {
          font-size: 18px;
        }
      }
    }
    
    .account-info {
      .account-name {
        font-size: 13px;
      }
      
      .account-detail {
        font-size: 11px;
      }
    }
  }
}
</style>