<template>
    <div>
        <div class="tk-search-box">
            <p class="tk-bond-name fs12">债券名称</p>
            <div class="clearfix">
                <Input v-model="value" size="large" class="tk-bond-input fl" placeholder="请搜索债券名称" autocomplete="on" style="width: 268px;" @on-enter="getSearch" />
                <span class="fl tk-search-btn tc fs14" data-flag="true" @click="getSearch">查询</span>
                <span class="fl tk-reset-btn tc fs14" @click="getReset">重置</span>
            </div>
        </div>
        <div class="clearfix">
            <p class="fl fs14 tk-grade-name">评级</p>
            <span class="fl fs15 tk-grade-val">AAA</span>
        </div>
        <div class="tk-grade-content-box">
            <div class="tk-grade-list" v-for="(item, index) in gradeLists" :key="index">
                <p class="tk-company-name fs16 tc">ST康得新</p>
                <div class="tk-company-content tc">
                    <div class="tk-company-left">
                        <span class="tk-grade-price-name show">净价</span>
                        <p class="tk-grade-price">90.00</p>
                    </div>
                    <div class="tk-company-right">
                        <span class="tk-grade-price-name show">YTM</span>
                        <p class="tk-grade-price">5%</p>
                    </div>
                </div>
                <p class="tk-grade-result tc fs12">债券评级AAA</p>
                <em class="tk-grade-checkbox tk-grade-checkbox-active" data-iconflag=""></em>
            </div>
        </div>
        <div class="tc tk-grade-pages">
            <Page :total="total" class-name="tk-cut-page" :page-size="12" show-total show-elevator @on-change="changePage"/>
        </div>
        <div>
            <p class="tk-compute-rate fs18">计算组合违约概率</p>
            <div class="tk-compute-rate-content">
                <div class="tk-compute-rate-list">
                    <p class="tk-compute-company-name fs16 tc">广大证券</p>
                    <div>
                        <p class="tk-grade-compute-price">90.00</p>
                        <span class="tk-grade-compute-price-name">净价</span>
                    </div>
                    <div class="clearfix">
                        <span class="fl fs12 tk-distribution-name">分配比例</span>
                        <Input size="large" class="tk-distribution-input fl" placeholder="" autocomplete="on" style="width: 268px;" @on-blur="getSearch" />
                    </div>
                    <em class="tk-compute-delete-icon"></em>
                </div>
                <div class="tk-compute-rate-list"></div>
                <div class="tk-compute-rate-list"></div>
                <div class="tk-compute-rate-list"></div>
                <div class="tk-compute-rate-list"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'tkGradeType',
    data() {
        return {
            value: '',
            value1: '',
            gradeLists: ['','','','','','','','','','','',''],
            total: 60,
        }
    },
    mounted() {
        console.log(this.$route.query.gradeVal)
        // this.gradeName = this.$route.query.gradeVal || this.gradeName;
    },
    methods: {
        getSearch() {
            console.log(this.value)
        },
        getSearch(e) {
            // 搜索
            console.log(e.target.dataset.flag)
            e.target.dataset.flag = !e.target.dataset.flag
            console.log(e.target.dataset.flag)
            console.log(this.value, e)
        },
        getReset() {
            // 重置
            this.value = '';
        },
        changePage(index) {
            console.log(index)
        },
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
    .tk-bond-input {
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
        margin-left: 20px;
    }
    .tk-reset-btn {
        background-color: #eaeaea;
        color: #525875;
        margin-left: 10px;
    }
    .tk-grade-name {
        color: #a2a5b6;
        height: 50px;
        line-height: 50px;
        margin-top: 13px;
    }
    .tk-grade-val {
        color: #404768;
        height: 50px;
        line-height: 50px;
        margin-left: 13px;
        margin-top: 13px;
    }
    .tk-grade-content-box {
        -webkit-display: flex;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        flex-direction: row;
    }
    .tk-grade-list {
        height: 152px;
        width: calc(25% - 13px);
        margin: 11px 0;
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
        padding: 8px 16px;
        background-color: #ffffff;
        -webkit-display: flex;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        flex-direction: row;
    }
    .tk-compute-rate-list {
        position: relative;
        width: calc(25% - 10px);
        margin: 8px 0;
        height: 134px;
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
        height: 32px;
        line-height: 32px;
        display: inline-block;
        margin-left: 22%;
        margin-top: 2px;
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
</style>
<style>
    .tk-compute-rate-list .ivu-input-large {
        width: 125px !important;
        height: 32px;
        line-height: 32px;
    }
</style>
