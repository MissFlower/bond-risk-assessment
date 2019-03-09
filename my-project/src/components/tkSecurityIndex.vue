<template>
    <div class="tk-container w">
        <risk-assessment-header></risk-assessment-header>
        <div class="tk-content clearfix">
            <div class="fl tk-content-left">
                <!-- <Select v-model="companyName" style="width:175px" placeholder="评级公司">
                    <Option v-for="(item, index) in companyLists" :value="item" :key="index">{{ item }}</Option>
                </Select> -->
                <Menu :theme="theme" style="width:175px" :active-name="companyName">
                    <Submenu name="1">
                        <template slot="title">
                            评级公司
                        </template>
                        <MenuItem :name="item" v-for="(item, index) in companyLists" :key="index" @click.native="getCompany(item)">{{ item }}</MenuItem>
                        <!-- <MenuItem name="1-2">评论管理</MenuItem>
                        <MenuItem name="1-3">举报管理</MenuItem> -->
                    </Submenu>
                </Menu>
                <div>
                    <p class="tk-type-name tk-type-name-grade fs19">评级</p>
                    <div class="tk-grade-name-box clearfix">
                        <span class="fl tk-grade-name-list tc " :class="[currentGradeIndex == index ? 'tk-mode-name-list-active' : '']" v-for="(gradeNameList, index) in gradeData" :key="index" @click="gradeEvent(index, gradeNameList)">{{ gradeNameList }}</span>
                    </div>
                </div>
            </div>
            <div class="fl tk-content-right">
                <div class="tk-search-box">
                    <p class="tk-bond-name fs12">债券名称</p>
                    <div class="clearfix">
                        <div class="fl tk-bond-input-box">
                            <Input v-model="value" size="large" class="tk-bond-input" placeholder="请搜索债券名称" autocomplete="on" style="width: 268px;" @on-enter="getSearch" @keyup.delete.native="getDeleteData" @on-change="getDataChange" @on-blur="getSearchBlur" @on-focus="getDataChange" />
                            <ul class="tk-bond-search-result" :class="[searchFlag ? 'show' : 'hide']">
                                <li class="tk-bond-search-result-list" v-for="(item, index) in screenResults" :key="index" @click="getScreenVal(item)">{{item}}</li>
                            </ul>
                        </div>
                        <span class="fl tk-search-btn tc fs14" @click="getSearch">查询</span>
                        <span class="fl tk-reset-btn tc fs14" @click="getReset">重置</span>
                        <div class="fl tk-model-radio">
                            <RadioGroup v-model="model" @on-change="modelChange">
                                <Radio label="多因子"></Radio>
                                <Radio label="动态违约率"></Radio>
                            </RadioGroup>
                        </div>
                        <div class="fl tk-model-sort clearfix">
                            <span class="fl tk-Intelligent-sorting fs16">智能排序</span>
                            <div class="fl tk-triangle-box">
                                <span class="tk-positive-triangle" :class="[isActive ? 'tk-triangle-up-active' : '']" @click="ascendingOrder"></span>
                                <span class="tk-Inverted-triangle" :class="[isActive ? '' : 'tk-triangle-down-active']" @click="descendingOrder"></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tk-content-right-box clearfix">
                        <div class="tk-mode-list fl" v-for="(item, index) in modeListDatas" :key="index" @click="getRiskInfo(item.secName, item.kmvModelRisk, item.mfModeRisk, item.rateFormer)">
                            <p class="tk-mode-list-name tc fs16">{{ item.secName }}</p>
                            <div class="tk-value-risk-box tc">
                                <div class="tk-multiple-factors">
                                    <p class="fs12 tk-model-type-name">多因子违约率</p>
                                    <span class="fs20 tk-model-type-value show">{{ item.kmvModelRisk }}</span>
                                </div>
                                <div class="tk-dynamic">
                                    <p class="fs12 tk-model-type-name">动态违约率</p>
                                    <span class="fs20 tk-model-type-value show">{{ item.mfModeRisk }}</span>
                                </div>
                                <em class="tk-dynamic-vertical"></em>
                            </div>
                            <span class="tk-bond-rata fs12 tc show">债券评级{{ item.rateFormer }}</span>
                        </div>
                </div>
                <div class="tc" :class="[totalPage > 1 ? 'show' : 'hide']">
                    <div class="tk-page-box">
                        <Page :total="total" :id="pageId" :current="currentPage" class-name="tk-cut-page" :page-size="12" :page-size-opts="[12,16,20]" show-total show-elevator show-sizer @on-change="changePage" style="float: left;" @on-page-size-change="changePageSize"/>
                        <div class="fl tk-page-link-btn">
                            <Button type="primary" size="large" @click="goElevatorPage">跳转</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import riskAssessmentHeader from './public/riskAssessmentHeader'
export default {
    name: "TkSecurityIndex",
    data() {
        return {
            currentGradeIndex: 0,
            currentGradeName: 'AAA',
            companyName: '中诚信国际信用评级有限责任公司',
            companyLists: ['泰康','中诚信国际信用评级有限责任公司','联合信用评级有限公司','中诚信证券评估有限公司','大公国际资信评估有限公司','中证鹏元资信评估股份有限公司','上海新世纪资信评估投资服务有限公司','东方金诚国际信用评估有限公司','远东资信评估有限公司','标准普尔评级服务公司'],
            modeData: ['动态评估','多因子'],
            gradeData: ['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC', 'CC', 'C', 'D'], 
            modeListDatas: [], // 后台返回数据
            total: 0, //总条数
            value: '', //搜索框
            theme: 'light',
            model: '多因子', // 默认模型（前端显示）
            pageId: 'tkPage',
            isActive: true, // 评级样式选择控制
            searchFlag: false, //控制搜索框下面list列表显隐
            searchResults: [],//存储页面初始化接收后台所有的债券名称
            screenResults: [], //存储根据用户输入筛选过的债券名,
            order: '升序', // 降序升序 默认升序
            pageNum: '1', // 初始化页码
            pageSize: '12', // 初始化每页给12条数据
            totalPage: 2, // 总页数
            repeatClickFlag: false, // 重复点击标记
            currentPage: 1, // 当前页码
            orderBy: 'kmv', // 默认模型
       };
    },
    components: {
        riskAssessmentHeader
    },
    mounted() {
        this.getData();
        let Timer = setTimeout(() => {
            this.getNameData();
            clearTimeout(Timer);
        },2000)
    },
    methods: {
        getData() { //获取数据
            const that = this;
            that.$Message.loading({
                content: '数据请求发送中...',
                duration: 0
            });
            let data = {
                orderBy: that.orderBy, //模型
                order: that.order, // 升序、降序
                rateFormer: that.currentGradeName, //评级
                company: that.companyName, //公司
                pageNum: that.currentPage, // 页码
                pageSize: that.pageSize, // 每页条数
            }
            that.$post('cbond_model/cbonds/queryCbondList', data)
                .then((response) => {
                    that.$Message.destroy();
                    if (response.data.status == '0') {
                        // console.log(response)
                        let res = response.data.data;
                        that.modeListDatas = res.list;
                        that.total = Number(res.page.totalResult);
                        that.totalPage = res.page.totalPage;
                        that.repeatClickFlag = true;
                    }else{
                        that.$Message.error({
                            content: '请求异常！',
                            duration: 3
                        });
                    }
                })
                .catch((err) => {
                    that.$Message.destroy();
                    console.log(err)
                    that.$Message.error({
                        content: '数据请求失败！',
                        duration: 3
                    });
                    that.repeatClickFlag = true;
                })
        },
        getNameData() {
            const that = this;
            let data = {};
            that.$post('cbond_model/cbonds/queryAllCbondName', data)
                .then((response) => {
                    if (response.data.status == '0') {
                        // console.log(response)
                        let res = response.data.data;
                        that.searchResults = res;
                        // console.log(res)
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        gradeEvent(index, gradeNameList) {
            // 获取评级
            const that = this;
            if (that.currentGradeIndex == index) {
                return false;
            }
            if (that.repeatClickFlag) {
                that.currentPage = 1;
                that.currentGradeIndex = index;
                that.currentGradeName = gradeNameList;
                console.log(gradeNameList)
                that.getData()
            }
        },
        getCompany(index) {
            // 获取公司
            const that = this;
            if (that.companyName == index) {
                return false;
            }
            if (that.repeatClickFlag) {
                console.log(index)
                that.currentPage = 1;
                that.companyName = index;
                that.getData()
            }
        },
        changePage(index) {
            // 页码改变
            const that = this;
            if (that.repeatClickFlag) {
                console.log(index)
                that.currentPage = index;
                that.getData()
            }
        },
        changePageSize(index) {
            // 每页页面获取数量
            const that = this;
            if (that.repeatClickFlag) {
                that.currentPage = 1;
                // console.log(index, this.pageNum)
                that.pageSize = index;
            }
        },
        getSearch() {
            // 搜索
            const that = this;
            console.log(that.value)
            if (that.value) {
                that.$Message.loading({
                    content: '正在查询...',
                    duration: 0
                });
                let data = {
                    secName: that.value
                }
                that.$post('cbond_model/cbonds/queryCbondByName', data)
                    .then((response) => {
                        if (response.data.status == '0') {
                            that.$Message.destroy();
                            // console.log(response)
                            let res = response.data.data;
                            that.modeListDatas = [];
                            that.modeListDatas.push(res);
                            that.totalPage = 1;
                            // console.log(res)
                        }
                    })
                    .catch((err) => {
                        that.$Message.destroy();
                        console.log(err)
                    })
            }else{
                that.$Message.error({
                    content: '求输入您要查询的债券名称！',
                    duration: 3
                });
            }
        },
        getReset() {
            // 重置
            this.value = '';
        },
        getRiskInfo(name, kmv, mf, grade) {
            // 点击跳转
            this.$router.push({
                path: 'riskInfo',//跳转路由
                query:{//参数对象
                    name: name,
                    kmv: kmv,
                    mf: mf,
                    grade: grade
                }
            })
        },
        ascendingOrder() {
            // 升序排列
            const that = this;
            if (that.repeatClickFlag) {
                that.currentPage = 1;
                that.isActive = true;
                console.log('升序')
                that.order = '升序';
                that.getData()
            }
        },
        descendingOrder() {
            // 降序排列
            const that = this;
            if (that.repeatClickFlag) {
                that.currentPage = 1;
                that.isActive = false;
                console.log('降序')
                that.order = '降序';
                that.getData()
            }
        },
        modelChange(index) {
            // 模型改变
            const that = this;
            if (that.repeatClickFlag) {
                console.log(index)
                that.currentPage = 1;
                if (index == '多因子') {
                    that.orderBy = 'kmv'
                }else if(index == '动态违约率') {
                    that.orderBy = 'mf'
                }
                this.getData()
            }
        },
        getDataChange(event) {
            // 搜索数据改变
            let currentVal = event.target.value;
            const that = this;
            console.log(event)
            that.currentPage = 1;
            if(currentVal) {
                console.log(currentVal)
                that.searchFlag = true;
                // const regVal = /^+ value +.*$/;
                const regVal = new RegExp("^"+ currentVal +".*$");
                // console.log(regVal.test('我是我'));
                const searchDatas = that.searchResults;
                const Len = searchDatas.length;
                let screenResults = [];
                for (let i = 0; i < Len; i++) {
                    const element = searchDatas[i];
                    if (regVal.test(element)) {
                        screenResults.push(element)
                    }
                }
                that.screenResults = screenResults;
            }
        },
        getScreenVal(name) {
            // 获取筛选结果渲染后输入框
            console.log(name)
            const that = this;
            that.value = name;
            that.searchFlag = false;
        },
        getSearchBlur() {
            // 搜索框失去焦点
            const that = this;
            let Timer = setTimeout(() => {
                that.searchFlag = false;
                clearTimeout(Timer)
            },300)
        },
        getDeleteData() {
            // 监听搜索框删除事件
            const that = this;
            let currentVal = that.value;
            if (currentVal) {
                console.log(currentVal)
                that.searchFlag = true;
            }else{
                that.searchFlag = false;
            }
        },
        goElevatorPage() {
            var evtObj;
            var thisPage=document.getElementById(this.pageId);
            var elevatorDiv=thisPage.getElementsByClassName("ivu-page-options-elevator");
            if(elevatorDiv && elevatorDiv.length>0){
                var pageInput = elevatorDiv[0].getElementsByTagName("input")[0];
                var value = pageInput.value;
                    if (window.KeyEvent) {//firefox 浏览器下模拟事件
                        evtObj = document.createEvent('KeyEvents');
                        evtObj.initKeyEvent("keyup", true, true, window, true, false, false, false, 13, 0);
                    } else {//chrome 浏览器下模拟事件
                        evtObj = document.createEvent('UIEvents');
                        evtObj.initUIEvent("keyup", true, true, window, 1);
                        delete evtObj.keyCode;
                        if (typeof evtObj.keyCode === "undefined") {//为了模拟keycode
                            Object.defineProperty(evtObj, "keyCode", { value: 13 });                       
                        } else {
                            evtObj.key = String.fromCharCode(13);
                        }
                    }
                    pageInput.dispatchEvent(evtObj);
            }
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .tk-container {
        background-color: #f6f7fb;
    }
    .tk-content {
        margin-top: 21px;
    }
    .tk-content-left {
        width: 175px;
        background-color: #ffffff;
        color: #ffffff;
        margin-left: 21px;
    }
    .tk-type-name {
        color: #484f6e;
        padding-left: 15px;
        height: 51px;
        line-height: 51px;
        border-top: 1px solid #e5e6eb;
    }
    .tk-mode-name-list {
        height: 32px;
        color: #979aac;
        line-height: 32px;
        border-radius: 16px;
        margin: 5px 10px ;
        padding: 0 15px;
        cursor: pointer;
        border: 1px solid #c9cbda;
    }
    .tk-mode-name-list:hover,.tk-mode-name-list:active,.tk-grade-name-list:hover,.tk-grade-name-list:active {
        background-color: #094c8e;
        /* background-color: #2d8cf0; */
        color: #ffffff;
    }
    .tk-type-name-grade {
        margin-top: 15px;
    }
    .tk-grade-name-box {
        margin-left: 4px;
        padding-bottom: 20px;
    }
    .tk-grade-name-list {
        width: 60px;
        height: 32px;
        line-height: 32px;
        border: 1px solid #c9cbda;
        -webkit-border-radius: 16px;
        -moz-border-radius: 16px;
        border-radius: 16px;
        cursor: pointer;
        color: #979aac;
        margin: 10px;
    }
    .tk-mode-name-list-active {
        color: #ffffff;
        background-color: #094c8e;
    }
    .tk-content-right {
        width: calc(100% - 196px);
    }
    .tk-content-right-box {
        margin: 0 5px;
        min-height: 400px;
    }
    .tk-mode-list {
        background-color: #ffffff;
        height: 150px;
        width: calc(25% - 30px);
        margin: 10px 15px;
        box-shadow: 0 0 20px #dddddd;
        cursor: pointer;
    }
    .tk-bond-input-box {
        width: 268px;
        margin-left: 20px;
        position: relative;
    }
    .tk-bond-search-result {
        width: 100%;
        position: absolute;
        top: 38px;
        left: 0px;
        border: 1px solid #dcdee2;
        -webkit-box-shadow: 0 0 10px #dddddd;
        -moz-box-shadow: 0 0 10px #dddddd;
        box-shadow: 0 0 10px #dddddd;
        z-index: 100;
        max-height: 140px;
        overflow-y: auto;
    }
    .tk-bond-search-result-list {
        height: 34px;
        line-height: 34px;
        background-color: #ffffff;
        border-bottom: 1px solid #dcdee2;
        padding-left: 5px;
    }
    .tk-bond-search-result-list:last-child {
        border-bottom: none;
    }
    .tk-bond-search-result-list:hover {
        background-color: #eaecf3;
    }
    .tk-search-box {
        height: 132px;
        background-color: #ffffff;
        margin: 0 20px 20px;
    }
    .tk-bond-name {
        padding-top: 32px;
        color: #989bad;
        line-height: 20px;
        margin-bottom: 8px;
        margin-left: 20px;
    }
    .tk-search-btn, .tk-reset-btn {
        height: 36px;
        line-height: 36px;
        width: 80px;
        border-radius: 2px;
        cursor: pointer;
    }
    .tk-search-btn {
        background-color: #094c8e;
        color: #ffffff;
        margin-left: 1.8%;
    }
    .tk-reset-btn {
        background-color: #eaeaea;
        color: #525875;
        margin-left: .9%;
    }
    .tk-mode-list-name {
        height: 48px;
        line-height: 48px;
        color: #404768;
        margin-top: 4px;
    }
    .tk-value-risk-box {
        display: -webkit-flex; /* Safari */
        display: flex;
        position: relative;
    }
    .tk-multiple-factors,.tk-dynamic {
        flex: 1;
    }
    .tk-dynamic-vertical {
        width: 0px;
        height: 42px;
        border: 1px dashed #eeeff3;
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }
    .tk-model-type-name {
        height: 20px;
        line-height: 20px;
        color: #9ea2b3;
    }
    .tk-model-type-value {
        height: 28px;
        line-height: 28px;
        color: #ff6a6a;
    }
    /* .tk-value-risk {
        height: 30px;
        line-height: 30px;
        color: #ff6a6a;
        padding-left: 28%;
        font-size: 28px;
    }
    .tk-value-risk-name {
        position: absolute;
        right: 50px;
        bottom: 0px;
        color: #a7aab9;
    } */
    .tk-bond-rata {
        height: 50px;
        line-height: 50px;
        color: #979bad;
    }
    .tk-page-box {
        height: 100px;
        line-height: 100px;
        display: inline-block;
    }
    .ivu-menu-vertical .ivu-menu-item, .ivu-menu-vertical .ivu-menu-submenu-title {
        padding: 8px 5px;
    }
    .ivu-menu-vertical .ivu-menu-submenu-title {
        color: #404768;
    }
    .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
        color: #404768;
    }
    .tk-content-left .ivu-menu {
        color: #9699ac;
        font-size: 18px;
    }
    .tk-content-left .ivu-menu-item {
        color: #9699ac;
        border-bottom: 1px dashed #fbfbfc;
        padding-left: 5px !important;
        text-align: center;
    }
    .tk-content-left .ivu-menu-item:first-child {
        border-top: 1px dashed #fbfbfc;
    }
    .tk-content-left .ivu-menu-item:last-child {
        border-bottom: none;
    }
    .tk-model-sort {
        margin-left: 5.4%;
    }
    .tk-model-radio {
        margin-left: 9.6%;
        height: 36px;
        line-height: 36px;
    }
    .tk-Intelligent-sorting {
        color: #9497ab;
        height: 36px;
        line-height: 36px;
    }
    .tk-triangle-box {
        position: relative;
        width: 16px;
        height: 20px;
        /* background-color: #cccccc; */
        margin: 8px 0 0 12px;
    }
    .tk-positive-triangle {
        width: 0px;
        height: 0px;
        border: 8px solid transparent;
        border-bottom-color: #bfbfbf;
        position: absolute;
        top: -7px;
        left: 0px;
        cursor: pointer;
    }
    .tk-Inverted-triangle {
        width: 0px;
        height: 0px;
        border: 8px solid transparent;
        border-top-color: #bfbfbf;
        position: absolute;
        bottom: -7px;
        left: 0px;
        cursor: pointer;
    }
    .tk-triangle-up-active {
        border-bottom-color: #094c8e;
    }
    .tk-triangle-down-active {
        border-top-color: #094c8e;
    }
    .tk-page-link-btn {
        margin: 4px 30px;
        line-height: 94px;
    }
    .ivu-btn-large {
        padding: 4px 12px;
    }
    .ivu-btn-primary {
        background-color: #094c8e;
        border-color: #094c8e;
    }
    .ivu-radio-checked .ivu-radio-inner {
        border-color: #094c8e;
    }
</style>
<style>
    /* .tk-cut-page .ivu-page-item:hover {
        border-color: #094c8e;
    }
    .tk-cut-page .ivu-page-item-active {
        border-color: #094c8e;
    } */
</style>

