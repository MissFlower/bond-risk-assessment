<template>
    <div class="tk-container w">
        <risk-assessment-header></risk-assessment-header>
        <div class="clearfix tk-cem-content">
            <div class="fl tk-cem-left">
                <Tabs value="grade" @on-click="changeType">
                    <TabPane label="评级" name="grade">
                        <ul class="clearfix tk-grade-box">
                            <li class="tk-grade-list fs14 tc fl" :class="[currentGradeIndex == index ? 'tk-grade-list-active' : '']" v-for="(gradeNameList, index) in rateLists" :key="index" @click="gradeEvent(index, gradeNameList)">{{ gradeNameList }}</li>
                        </ul>
                    </TabPane>
                    <TabPane label="公司" name="company">
                        <ul>
                            <li class="tk-company-list fs14 tc" :class="[currentCompanyIndex == index ? 'tk-company-list-active' : '']" v-for="(companyName, index) in companyLists" :key="index" @click="getCompany(index, companyName)">{{ companyName }}</li>
                        </ul>
                    </TabPane>
                    <TabPane label="YTM" name="yieldRate">
                        <div class="tk-rate-list-box">
                            <ul>
                                <li class="tk-rate-list fs14" :class="[currentRateIndex == index ? 'tk-rate-list-active' : '']" v-for="(yieldRate, index) in yieldRatelists" :key="index" @click="getYieldRate(index, yieldRate)">{{ yieldRate }}</li>
                            </ul>
                            <span class="tk-rate-list-vertical" :style="{'transform': 'translate3d(0px,'+ currentRateIndex * 40 + 'px, 0px)'}"></span>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
            <div class="fl tk-cem-right">
                <!-- <router-view :searchResults="bondCompanyResult" ref="child" @clickFlag="clickFlagEvent"></router-view> -->
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
                    </div>
                </div>
                <div class="clearfix">
                    <p class="fl fs14 tk-grade-name">{{ currentTypeName }}</p>
                    <span class="fl fs15 tk-grade-val">{{ currentTypeValue }}</span>
                </div>
                <div class="tk-grade-content-box clearfix">
                    <div class="tk-grade-list fl" v-for="(item, index) in gradeLists" :key="index">
                        <p class="tk-company-name fs16 tc">{{ item.name }}</p>
                        <div class="tk-company-content tc">
                            <div class="tk-company-left">
                                <span class="tk-grade-price-name show">净价</span>
                                <p class="tk-grade-price">{{ item.pqClose }}</p>
                            </div>
                            <div class="tk-company-right">
                                <span class="tk-grade-price-name show">YTM</span>
                                <p class="tk-grade-price">{{ item.ytm }}</p>
                            </div>
                        </div>
                        <p class="tk-grade-result tc fs12">债券评级{{ item.rateFormer }}</p>
                        <em class="tk-grade-checkbox" :class="[item.checkFlag ? 'tk-grade-checkbox-active' : '']" :data-checkflag="item.checkFlag" @click="checkEvent($event, index, {name: item.name, pqClose: item.pqClose, ytm: item.ytm, rateFormer: item.rateFormer, listIndex: item.listIndex, code: item.code}, item.listIndex)"></em>
                    </div>
                </div>
                <div class="tc tk-grade-pages" :class="[totalPage > 1 ? 'show' : 'hide']">
                    <Page :total="total" :current="currentPage" class-name="tk-cut-page" :page-size="12" show-total show-sizer show-elevator :page-size-opts="[12,16,20]" @on-change="changePage" @on-page-size-change="changePageSize"/>
                </div>
                <div>
                    <p class="tk-compute-rate fs18">计算组合违约概率</p>
                    <div class="tk-compute-rate-content">
                        <div class="clearfix tk-compute-rate-con">
                            <div class="tk-compute-rate-list fl" v-for="(item, index) in computedLists" :key="index">
                                <p class="tk-compute-company-name fs16 tc">{{ item.name }}</p>
                                <div class="tk-company-content tk-company-computed-content tc">
                                    <div class="tk-company-left">
                                        <span class="tk-grade-price-name show">净价</span>
                                        <p class="tk-grade-price">{{ item.pqClose }}</p>
                                    </div>
                                    <div class="tk-company-right">
                                        <span class="tk-grade-price-name show">YTM</span>
                                        <p class="tk-grade-price">{{ item.ytm }}</p>
                                    </div>
                                </div>
                                <!-- <div class="clearfix">
                                    <span class="fl fs12 tk-distribution-name">分配比例</span>
                                    <Input size="large" class="tk-distribution-input fl" placeholder="" autocomplete="on" style="width: 268px;" @on-blur="getSearch" />
                                </div> -->
                                <em class="tk-compute-delete-icon" @click="deleteComputedEvent(index)"></em>
                            </div>
                        </div>
                        <div class="clearfix">
                            <span class="tk-computed-btn fs19 tc show fl" :class="[computedActiveBtn ? 'tk-computed-btn-active' : '']" @click="startComputed">开始计算</span>
                            <div class="fl tk-computed-value-box tr fs24 clearfix" :class="[computedValueFlag ? 'show' : 'hide']">
                                <p class="clearfix fl">
                                    <span class="fl tc tk-computed-name">VAR：</span>
                                    <span class="fl tk-computed-val">{{ computedValue }}</span>
                                </p>
                                <p class="clearfix fl">
                                    <span class="fl tc tk-computed-name">YTM：</span>
                                    <span class="fl tk-computed-val">{{ computedYtm }}</span>
                                </p>
                            </div>
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
    name: 'combinationEvaluationModel', //组合评估模型
    data() {
        return {
            currentGradeIndex: 0,
            currentCompanyIndex: 0,
            currentRateIndex: 0,
            currentGradeName: 'AAA',
            currentCompanyName: '泰康',
            currentRateName: '<0',
            rateLists: ['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC', 'CC', 'C'],
            companyLists: ['泰康', '联合信用评级有限公司', '中诚信证券评估有限公司', '大公国际资信评估有限公司', '中证鹏元资信评估股份有限公司', '上海新世纪资信评估投资服务有限公司', '东方金诚国际信用评估有限公司', '远东资信评估有限公司', '标准普尔评级服务公司'],
            yieldRatelists: ['<0', '0~4%', '4%~8%', '8%~10%', '>=10%'],
            currentType: 'grade',
            bondCompanyResult: [],//存储页面初始化接收后台所有的债券名称
            screenResults: [], //存储根据用户输入筛选过的债券名,
            typeData: {}, //类型数据 评级、公司、ytm
            currentTypeName: '评级', // 右侧切换展示评级、公司、ytm
            currentTypeValue: 'AAA', // 右侧切换展示评级、公司、ytm的值
            currentTp: 'rateFormer', // 向后台传的类型默认值
            value: '', // 搜索的值
            gradeLists: [],
            total: 0,
            computedLists: [],
            computedActiveBtn: false, // 计算button状态变化
            searchFlag: false, //控制搜索下拉列表显隐
            currentPage: 1,
            rateFormer: 'AAA', // 评级参数 默认AAA
            pageSize: 12, // 默认每页展示12条数据
            totalPage: 1, // 总页数
            repeatClickFlag: false, // 防止重复点击烂请求
            checkListIndex: [], // 所有选中list下标
            computedValue: '', // 违约概率值
            computedYtm: '', // YTM值
            computedValueFlag: false, // 控制显示结果显隐
            computedClickFlag: true, // 计算时间防止重复触发
        }   
    },
    components: {
        riskAssessmentHeader
    },
    mounted() {
        const that = this;
        // that.$router.push({
        //     path: '/enterModel/grade',
        // })
        that.getData();
        let Timer = setTimeout(() => {
            that.getNameData();
            clearTimeout(Timer);
        },2000)
    },
    methods: {
        changeType(val) {
            const that = this;
            if (val == this.currentType) {
                return false;
            }
            // that.$router.push({
            //     path: '/enterModel/'+ val
            // })
            if (that.computedClickFlag && that.repeatClickFlag) {
                that.currentType = val;
                if (val == 'grade') {
                    that.currentGradeIndex = 0;
                    that.currentGradeName = 'AAA';
                    that.currentTypeName = '评级';
                    that.currentTypeValue = 'AAA';
                    that.currentTp = 'rateFormer';
                }else if(val == 'company') {
                    that.currentCompanyIndex = 0;
                    that.currentTypeName = '公司';
                    that.currentTypeValue = '泰康';
                    that.currentTp = 'company';
                }else if(val == 'yieldRate') {
                    that.currentRateIndex = 0;
                    that.currentTypeName = 'YTM';
                    that.currentTypeValue = '<0';
                    that.currentTp = 'ytm';
                }
                that.getData();
                that.repeatClickFlag = false;
            }
        },
        getNameData() {
            const that = this;
            that.$post('cbondModel/cbonds/queryZjmc',{})
                .then((response) => {
                    if (response.status === 200) {
                        console.log(response)
                        let res = response.data;
                        that.bondCompanyResult = res;
                        // console.log(res)
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        clickFlagEvent(clickFlagData) {
            console.log(clickFlagData);
            const that = this;
            that.clickFlagData = clickFlagData;
        },
        gradeEvent(index, gradeNameList) {
            // 获取评级
            const that = this;
            if (that.computedClickFlag && that.repeatClickFlag) {
                that.currentGradeIndex = index;
                that.currentGradeName = gradeNameList;
                that.currentTypeValue = gradeNameList;
                that.currentTp = 'rateFormer';
                that.getData();
                that.repeatClickFlag = false;
                // that.typeData={
                //     rateFormer: gradeNameList
                // }
                // that.$refs.child.transmitParam(that.typeData);
            }else{
                that.$Message.warning({
                    content: '数据请求中，请勿频繁点击！',
                    duration: 3
                });
            }
        },
        getCompany(index, companyName) {
            // 获取公司
            // console.log(index, companyName)
            const that = this;
            if (that.computedClickFlag && that.repeatClickFlag) {
                that.currentCompanyIndex = index;
                that.currentCompanyName = companyName;
                that.currentTypeValue = companyName;
                that.currentTp = 'company';
                that.getData();
                // that.typeData={
                //     name: companyName
                // }
                // that.$refs.child.transmitParam(that.typeData);
            }else{
                that.$Message.warning({
                    content: '数据请求中，请勿频繁点击！',
                    duration: 3
                });
            }
        },
        getYieldRate(index, yieldRate) {
            // 获取收益率
            const that = this;
            if (that.computedClickFlag && that.repeatClickFlag) {
                that.currentRateIndex = index;
                that.currentRateName = yieldRate;
                that.currentTypeValue = yieldRate;
                that.currentTp = 'ytm';
                that.getData();
                // console.log(yieldRate)
                // that.typeData={
                //     ytm: yieldRate,
                // }
                // that.$refs.child.transmitParam(that.typeData);
            }else{
                that.$Message.warning({
                    content: '数据请求中，请勿频繁点击！',
                    duration: 3
                });
            }
        },
        getData() {
            const that = this;
            that.$Message.loading({
                content: '数据请求发送中...',
                duration: 0
            });
            let data = {
                // rateFormer: that.currentTypeValue,
                pageNum: that.currentPage,
                pageSize: that.pageSize
            }
            data[that.currentTp] = that.currentTypeValue;
            that.$post('cbondModel/cbonds/queryPgsList', data)
                .then((response) => {
                    console.log(response)
                    that.$Message.destroy();
                    if (response.status === 200) {
                        const res = response.data;
                        if (res.status == '0') {
                            const data = res.data.list;
                            const pageData = res.data.page;
                            that.totalPage = pageData.totalPage;
                            that.total = pageData.totalResult;
                            if (data.length) {
                                const Len = data.length;
                                for (let i = 0; i < Len; i++) {
                                    const element = data[i];
                                    element.listIndex = element.code;
                                    element.checkFlag = false;
                                }
                                const listIndexLen = that.checkListIndex.length;
                                for (let i = 0; i < listIndexLen; i++) {
                                    const element1 = that.checkListIndex[i];
                                    for (let j = 0; j < Len; j++) {
                                        const element2 = data[j].listIndex;
                                        if (element1 == element2) {
                                            data[j].checkFlag = true;
                                        }
                                    }
                                }
                                that.gradeLists = data;
                            }else{
                                that.gradeLists = data;
                                that.$Message.success({
                                    content: '您选择的参数暂无数据！',
                                    duration: 3
                                });
                            }
                        }else if(res.status == '1') {
                            that.$Message.error({
                                content: '数据请求失败！',
                                duration: 3
                            });
                        }
                    }
                    that.repeatClickFlag = true;
                    // that.$emit('clickFlag', [that.repeatClickFlag, that.computedClickFlag]);
                })
                .catch((error) => {
                    that.$Message.destroy();
                    console.log(error)
                    that.$Message.error({
                        content: '数据请求失败！',
                        duration: 3
                    });
                    that.repeatClickFlag = true;
                    that.$emit('clickFlag', [that.repeatClickFlag, that.computedClickFlag]);
                })
        },
        getSearch() {
            // console.log(this.value)
            const that = this;
            if (that.computedClickFlag && that.repeatClickFlag) {
                that.repeatClickFlag = false;
                that.currentTp = 'name';
                that.currentTypeValue = that.value;
                that.getData();
            }else{
                that.$Message.error({
                    content: '数据请求中,请稍候查询！',
                    duration: 3
                });
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
                const searchDatas = that.bondCompanyResult;
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
                that.searchFlag = true;
            }else{
                that.searchFlag = false;
            }
        },
        getReset() {
            // 重置
            this.value = '';
        },
        changePage(index) {
            // 改变页面
            const that = this;
            that.currentPage = index;
            console.log(index)
            if (that.computedClickFlag && that.repeatClickFlag) {
                that.repeatClickFlag = false;
                that.getData();
            }else{
                that.$Message.warning({
                    content: '数据请求中，请勿频繁点击！',
                    duration: 3
                });
            }
        },
        changePageSize(index) {
            // 改变页面条数
            const that = this;
            if (that.computedClickFlag && that.repeatClickFlag) {
                that.repeatClickFlag = false;
                that.pageSize = index;
                that.currentPage = 1;
                that.getData();
            }else{
                that.$Message.warning({
                    content: '数据请求中，请勿频繁点击！',
                    duration: 3
                });
            }
        },
        checkEvent(even, index, value, listIndex) {
            // 选中事件切换
            const that = this;
            if (that.computedClickFlag && that.repeatClickFlag) {
                const checkFlag = !even.target.dataset.checkflag;
                let parentIndex; // 选中的list在父级下的顺序
                value.checkFlag = checkFlag;
                that.gradeLists.splice(index, 1, value);
                if (checkFlag) {
                    // 添加
                    that.computedLists.push(value);
                    that.checkListIndex.push(listIndex);
                }else{
                    // 删除
                    const Len = that.computedLists.length;
                    for (let i = 0; i < Len; i++) {
                        const element = that.computedLists[i];
                        console.log(element.listIndex, listIndex)
                        if (element.listIndex == listIndex) {
                            // 重选中数组里面去掉该数据
                            // console.log(that.computedLists)
                            const index = that.checkListIndex.indexOf(listIndex);
                            that.checkListIndex.splice(index, 1);
                            that.computedLists.splice(i, 1);
                            break;
                        }
                    }
                }
                that.computedActiveBtn = that.computedLists.length ? true : false;
                that.computedValueFlag = false;
            }else{
                that.$Message.warning({
                    content: '数据请求中，请勿频繁点击！',
                    duration: 3
                });
            }
        },
        deleteComputedEvent(index) {
            const that = this;
            if (that.computedClickFlag && that.repeatClickFlag) {
                let chiildData = that.computedLists[index];
                let listIndex = chiildData.listIndex;
                that.computedValueFlag = false;
                // 先从所有下标数组里删除该项
                const indx = that.checkListIndex.indexOf(listIndex);
                that.checkListIndex.splice(indx, 1);
                // 再从计算属性选中数组里删去该项
                that.computedLists.splice(index, 1);
                const parLen = that.gradeLists.length;
                for (let i = 0; i < parLen; i++) {
                    const element = that.gradeLists[i];
                    if (element.listIndex == listIndex) {
                        element.checkFlag = false;
                        that.gradeLists.splice(i, 1, element);
                        break;
                    }
                }
                const Len = that.computedLists.length;
                that.computedActiveBtn = Len ? true : false;
                that.computedValueFlag = false;
            }else{
                that.$Message.warning({
                    content: '数据请求中，请勿频繁点击！',
                    duration: 3
                });
            }
        },
        startComputed() {
            const that = this;
            if (!that.computedClickFlag) {
                that.$Message.warning({
                    content: '正在计算，请勿再次点击！',
                    duration: 3
                });
                return false;
            }
            that.computedClickFlag = false;
            that.$Message.loading({
                content: '计算中...',
                duration: 0
            });
            const Len = that.computedLists.length;
            let code = [];
            let ytm = [];
            for (let i = 0; i < Len; i++) {
                const element = that.computedLists[i];
                code.push(element.code);
                ytm.push(element.ytm);
            }
            let data = {
                code: code.join(','),
                ytm: ytm.join(',')
            }
            that.$post('cbondModel/cbonds/queryDefaultProbability',data)
                .then((response) => {
                    that.computedClickFlag = true;
                    that.$Message.destroy();
                    if (response.status === 200) {
                        const data = response.data;
                        that.computedValueFlag = true;
                        that.computedValue = data.res;
                        that.computedYtm = data.ytm;
                    }
                }) 
                .catch((error) => {
                    that.computedClickFlag = true;
                    console.log(error)
                    that.$Message.destroy();
                })
        }
    }
}
</script>

<style scoped>
    .tk-container {
        background-color: #f6f7fb;
    }
    .tk-cem-content {
        margin-top: 21px;
        padding-bottom: 50px;
    }
    .tk-cem-left {
        margin-left: 21px;
        width: 175px;
        background-color: #ffffff;
    }
    .tk-grade-box {
        margin-top: 10px;
        padding: 0 7px;
    }
    .tk-cem-left .tk-grade-list {
        width: 60px;
        height: 32px;
        -webkit-border-radius: 16px;
        -moz-border-radius: 16px;
        border-radius: 16px;
        border: 1px solid #c9cbd6;
        line-height: 32px;
        cursor: pointer;
        color: #979aac;
        margin: 10px;
    }
    .tk-cem-left .tk-grade-list-active {
        color: #ffffff;
        background-color: #094c8e;
    }
    .tk-company-list {
        color: #9a9caf;
        line-height: 20px;
        padding: 8px 5px;
        border-bottom: 1px dashed #f8f8fa;
        border-left: 3px solid transparent;
        border-left-color: rgb(9, 76, 142, 0);
    }
    .tk-company-list-active {
        color: #414869;
        border-left-color: rgb(9, 76, 142, 1);
        transition: 1s all ease-in-out;
    }
    .tk-rate-list {
        color: #9194a8;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px dashed #f8f8fa;
        padding-left: 13px;
    }
    .tk-rate-list-active {
        color: #414869;
    }
    .tk-rate-list-box {
        position: relative;
    }
    .tk-rate-list-vertical {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 3px;
        height: 40px;
        background-color: #094c8e;
        /* transition: .2s top ease-in-out; */
        -webkit-transition: transform .2s ease-in-out;
        -moz-transition: transform .2s ease-in-out;
        -ms-transition: transform .2s ease-in-out;
        transition: transform .2s ease-in-out;
        transform-origin: 0 0;
    }
    .tk-cem-right {
        width: calc(100% - 244px);
        margin: 0 24px;
    }

    .tk-search-box {
        height: 130px;
        background-color: #ffffff;
        padding-top: 23px;
    }
    .tk-bond-name {
        height: 36px;
        line-height: 36px;
        color: #85899e;
        margin-left: 20px;
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
    .tk-search-btn, .tk-reset-btn {
        height: 36px;
        line-height: 36px;
        width: 80px;
        -webkit-border-radius: 2px;
        -moz-border-radius: 2px;
        -ms-border-radius: 2px;
        -o-border-radius: 2px;
        border-radius: 2px;
        cursor: pointer;
    }
    .tk-search-btn {
        background-color: #094c8e;
        color: #ffffff;
        margin-left: 20px;
    }
    .tk-reset-btn {
        background-color: #eaeaea;
        color: #525875;
        margin-left: 10px;
    }
    .tk-grade-name {
        color: #a2a5b6;
        height: 24px;
        line-height: 24px;
        margin: 25px 0 5px 0;
    }
    .tk-grade-val {
        color: #404768;
        height: 24px;
        line-height: 24px;
        margin: 25px 0 5px 12px;
    }
    .tk-grade-content-box {
        -webkit-display: flex;
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        min-height: 400px;
        width: calc(100% + 10px);
        margin-left: -10px;
    }
    .tk-grade-list {
        height: 152px;
        width: calc(25% - 20px);
        margin: 11px 10px;
        background-color: #ffffff;
        position: relative;
        cursor: pointer;
        -webkit-transition: .5s all ease;
        -moz-transition: .5s all ease;
        -ms-transition: .5s all ease;
        -o-transition: .5s all ease;
        transition: .5s all ease;
        -webkit-transform: perspective(800px);
        -moz-transform: perspective(800px);
        -ms-transform: perspective(800px);
        -o-transform: perspective(800px);
        transform: perspective(800px);
    }
    .tk-company-name {
        margin-top: 20px;
        color: #030d3a;
        height: 34px;
        line-height: 34px;
    }
    .tk-grade-price {
        color: #ff5c21;
        font-size: 24px;
        height: 32px;
        line-height: 32px;
    }
    .tk-grade-compute-price-name {
        color: #a6a8b8;
    }
    .tk-grade-compute-price {
        color: #ff5c21;
        font-size: 24px;
        height: 42px;
        line-height: 42px;
        display: inline-block;
        margin-left: 33%;
    }
    .tk-grade-compute-price-name {
        color: #a6a8b8;
        display: inline-block;
        margin-left: 2%;
    }
    .tk-grade-result {
        color: #898da2;
        height: 42px;
        line-height: 42px;
    }
    .tk-grade-checkbox {
        width: 17px;
        height: 18px;
        border: 1px solid #cdcfd8;
        position: absolute;
        top: 10px;
        right: 4%;
    }
    .tk-grade-checkbox-active {
        background: url(../assets/icon/checked.png) -1px -2px no-repeat;
        -webkit-border-radius: 1px;
        -moz-border-radius: 1px;
        -ms-border-radius: 1px;
        -o-border-radius: 1px;
        border-radius: 1px;
    }
    .tk-company-content {
        -webkit-display: flex;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        flex-direction: row;
        margin-top: 6px;
        padding: 0 6%;
    }
    .tk-company-computed-content {
        margin-top: 16px;
    }
    .tk-company-computed-content .tk-grade-price {
        margin-top: 6px;
    }
    .tk-company-left,.tk-company-right {
        flex: 1;
    }
    .tk-company-left {
        border-right: 1px dashed #eeeff3;
    }
    .tk-grade-pages {
        height: 50px;
        line-height: 50px;
        margin-top: 20px;
    }
    .tk-compute-rate {
        color: #000732;
        height: 44px;
        line-height: 44px;
        margin-top: 21px;
    }
    .tk-compute-rate-content {
        padding: 8px 8px;
        background-color: #ffffff;
        /* -webkit-display: flex;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        flex-direction: row; */
    }
    .tk-compute-rate-con {
        min-height: 150px;
    }
    .tk-compute-rate-list {
        position: relative;
        width: calc(25% - 20px);
        margin: 8px 10px;
        height: 150px;
        background-color: #f6f7fb;
        cursor: pointer;
        -webkit-transition: .5s all ease;
        -moz-transition: .5s all ease;
        -ms-transition: .5s all ease;
        -o-transition: .5s all ease;
        transition: .5s all ease;
        -webkit-transform: perspective(800px);
        -moz-transform: perspective(800px);
        -ms-transform: perspective(800px);
        -o-transform: perspective(800px);
        transform: perspective(800px);
    }
    .tk-grade-list:hover,.tk-compute-rate-list:hover {
        -webkit-box-shadow: 0 0 10px #cccccc;
        -moz-box-shadow: 0 0 10px #cccccc;
        -ms-box-shadow: 0 0 10px #cccccc;
        -o-box-shadow: 0 0 10px #cccccc;
        box-shadow: 0 0 10px #cccccc;
        -webkit-transform: perspective(800px)  translate3d(0,0,20px);
        -moz-transform: perspective(800px)  translate3d(0,0,20px);
        -ms-transform: perspective(800px)  translate3d(0,0,20px);
        -o-transform: perspective(800px)  translate3d(0,0,20px);
        transform: perspective(800px)  translate3d(0,0,20px);
    }
    .tk-compute-company-name {
        margin-top: 12px;
        color: #252d52;
        height: 34px;
        line-height: 34px;
    }
    .tk-distribution-name {
        color: #9195a8;
        height: 37px;
        line-height: 37px;
        display: inline-block;
        margin-left: 22%;
    }
    .tk-distribution-input {
        width: 125px !important;
        margin-left: 10px;
        margin-top: 2px;
    }
    .tk-compute-delete-icon {
        width: 40px;
        height: 38px;
        position: absolute;
        top: 0;
        right: 0;
        background: url(../assets/icon/delete.png) 0 0 no-repeat;
        cursor: pointer;
    }
    .tk-computed-btn {
        width: 166px;
        height: 50px;
        line-height: 50px;
        color: #a5a8b7;
        background-color: #eaeaea;
        margin-left: 10px;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        -ms-border-radius: 5px;
        -o-border-radius: 5px;
        border-radius: 5px;
        margin-top: 22px;
    }
    .tk-computed-btn-active {
        cursor: pointer;
        background-color: #094c8e;
        color: #ffffff;
    }
    .tk-computed-value-box {
        margin-top: 22px;
        font-size: 24px;
    }
    .tk-computed-value-box p {
        height: 50px;
        line-height: 50px;
        margin-left: 50px;
    }
    .tk-computed-name {
        width: 80px;
    }
    .tk-computed-val {
        color: #ff5c21;
    }
</style>
<style>
    .tk-cem-left .ivu-tabs-nav .ivu-tabs-tab-active,.tk-cem-left .ivu-tabs-nav .ivu-tabs-tab:hover {
        color: #545a78;
    }
    .tk-cem-left .ivu-tabs-ink-bar {
        background-color: #094c8e;
    }
    .tk-cem-left .ivu-tabs-tab {
        color: #9295a9;
    }
    .tk-cem-left .ivu-tabs-ink-bar {
        width: 30px !important;
        left: 10px;
        height: 3px;
    }
    .tk-cem-left .ivu-tabs-nav .ivu-tabs-tab {
        margin: 4px 6px;
        padding: 8px 6px;
    }
    .tk-cem-left .ivu-tabs-bar {
        margin-bottom: 0px;
    }
    .tk-cem-left .ivu-tabs-nav {
        margin-left: 3px;
    }
    .tk-cem-left .ivu-tabs-tab:first-child {
        margin-right: 2px;
    }
    .tk-cem-left .ivu-tabs-tab:last-child {
        margin-left: 12px;
    }

    
    .tk-compute-rate-list .ivu-input-large {
        width: 125px !important;
        height: 32px;
        line-height: 32px;
    }
</style>



