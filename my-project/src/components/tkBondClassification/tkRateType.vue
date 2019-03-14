<template>
    <div>
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
            <p class="fl fs13 tk-yield-name">YTM</p>
            <span class="fl fs18 tk-yield-val">{{ ytm }}</span>
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
                <em class="tk-grade-checkbox" :class="[item.checkFlag? 'tk-grade-checkbox-active' : '']" :data-checkflag="item.checkFlag" @click="checkEvent($event, index, {name: item.name, pqClose: item.pqClose, ytm: item.ytm, listIndex: item.listIndex, code: item.code}, item.listIndex)"></em>
            </div>
        </div>
        <div class="tc tk-grade-pages" :class="[totalPage > 1 ? 'show' : 'hide']">
            <Page :total="total" class-name="tk-cut-page" :page-size="12" show-total show-sizer show-elevator :page-size-opts="[12,16,20]" @on-change="changePage" @on-page-size-change="changePageSize"/>
        </div>
        <div>
            <p class="tk-compute-rate fs18">计算组合违约概率</p>
            <div class="tk-compute-rate-content">
                <div class="clearfix tk-compute-rate-con">
                    <div class="tk-compute-rate-list fl" v-for="(item, index) in computedLists" :key="index">
                        <p class="tk-compute-company-name fs16 tc">{{ item.name }}</p>
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
                        <!-- <div class="clearfix">
                            <span class="fl fs12 tk-distribution-name">分配比例</span>
                            <Input size="large" class="tk-distribution-input fl" placeholder="" autocomplete="on" style="width: 268px;" @on-blur="getSearch" />
                        </div> -->
                        <em class="tk-compute-delete-icon" @click="deleteComputedEvent(index)"></em>
                    </div>
                </div>
                <div class="clearfix">
                    <span class="tk-computed-btn fs19 tc fl show" :class="[computedActiveBtn ? 'tk-computed-btn-active' : '']" @click="startComputed">开始计算</span>
                    <div class="fl tk-computed-value-box tr fs18 clearfix" :class="[computedValueFlag ? 'show' : 'hide']">
                        <p class="clearfix fl">
                            <span class="fl tc tk-computed-name">VAR：</span>
                            <span class="fl">{{ computedValue }}</span>
                        </p>
                        <p class="clearfix fl">
                            <span class="fl tc tk-computed-name">YTM：</span>
                            <span class="fl">{{ computedYtm }}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'tkRateType',
    props: ['searchResults'],
    data() {
        return {
            gradeLists: [],
            total: 0,
            value: '',
            searchFlag: false,
            screenResults: [],
            computedActiveBtn: false,
            computedLists: [],
            screenResults: [], //存储根据用户输入筛选过的债券名,
            searchFlag: false, //控制搜索下拉列表显隐
            currentPage: 1,
            ytm: '<0', // 收益率YTM参数 默认<0
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
    mounted() {
        // 初始化获取数据
        const that = this;
        that.getData();
    },
    methods: {
        transmitParam(parames) {
            const that = this;
            that.ytm = parames.ytm;
            if (that.repeatClickFlag) {
                that.repeatClickFlag = false;
                that.computedLists = [];
                that.checkListIndex = [];
                that.computedValueFlag = false;
                that.computedActiveBtn = false;
                that.getData();
                const Len = that.gradeLists.length;
                for (let i = 0; i < Len; i++) {
                    const element = that.gradeLists[i];
                    element.checkFlag = false;
                }
            }
        },
        getData() {
            const that = this;
            that.$Message.loading({
                content: '数据请求发送中...',
                duration: 0
            });
            that.$emit('clickFlag', [that.repeatClickFlag, that.computedClickFlag]);
            let data = {
                ytm: that.ytm,
                pageNum: that.currentPage,
                pageSize: that.pageSize,
                name: that.value
            }
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
                                    element.listIndex = that.currentPage+ '-' +i;
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
                    that.$emit('clickFlag', [that.repeatClickFlag, that.computedClickFlag]);
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
            const that = this;
            if (that.repeatClickFlag) {
                that.repeatClickFlag = false;
                that.getData();
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
            // console.log(name)
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
            },100)
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
        getReset() {
            // 重置
            this.value = '';
        },
        changePage(index) {
            // 改变页面
            console.log(index)
            const that = this;
            if (that.repeatClickFlag) {
                that.currentPage = index;
                that.getData();
            }
        },
        changePageSize(index) {
            // 改变页面条数
            const that = this;
            that.pageSize = index;
            that.currentPage = 1;
            that.computedLists = [];
            that.checkListIndex = [];
            that.computedValueFlag = false;
            that.computedActiveBtn = false;
            const Len = that.gradeLists.length;
            for (let i = 0; i < Len; i++) {
                const element = that.gradeLists[i];
                element.checkFlag = false;
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
                        const parentIndex = listIndex.split('-')[1];
                        that.gradeLists.splice(parentIndex, 1, element);
                        break;
                    }
                }
                const Len = that.computedLists.length;
                that.computedActiveBtn = Len ? true : false;
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
            that.$emit('clickFlag', [that.repeatClickFlag, that.computedClickFlag]);
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
                    that.$emit('clickFlag', [that.repeatClickFlag, that.computedClickFlag]);
                }) 
                .catch((error) => {
                    console.log(error)
                    that.computedClickFlag = true;
                    that.$Message.destroy();
                    that.$emit('clickFlag', [that.repeatClickFlag, that.computedClickFlag]);
                })
        }
    }
}
</script>

<style scoped>
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
    .tk-yield-name {
        color: #9c9eb0;
        height: 24px;
        line-height: 24px;
        margin: 25px 0 5px 0;
    }
    .tk-yield-val {
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
        width: calc(100% + 20px);
        margin-left: -10px;
        min-height: 400px;
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
        background: url(../../assets/icon/checked.png) -1px -2px no-repeat;
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
        background: url(../../assets/icon/delete.png) 0 0 no-repeat;
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
    }
    .tk-computed-value-box p {
        height: 50px;
        line-height: 50px;
        margin-left: 50px;
    }
    .tk-computed-name {
        width: 50px;
    }
</style>