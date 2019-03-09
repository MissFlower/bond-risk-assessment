<template>
    <div>
        <div class="clearfix">
            <p class="fl fs13 tk-company">公司</p>
            <span class="fl fs18 tk-company-val">联合信用评级有限公司</span>
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
                <em class="tk-grade-checkbox tk-grade-checkbox-active"></em>
            </div>
        </div>
        <div class="tc tk-grade-pages">
            <Page :total="total" class-name="tk-cut-page" :page-size="12" show-total show-elevator @on-change="changePage"/>
        </div>
    </div>
</template>

<script>
export default {
    name: 'tkCompanyType',
    data() {
        return {
            gradeLists: ['','','','','','','','','','','',''],
            total: 50,
        }
    },
    methods: {
        changePage(index) {
            console.log(index)
        }
    }

}
</script>

<style scoped>
    .tk-company {
        color: #9c9eb0;
        height: 24px;
        line-height: 24px;
    }
    .tk-company-val {
        color: #404768;
        height: 24px;
        line-height: 24px;
        margin-left: 12px;
        margin-bottom: 15px;
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
        background: url(../../../static/icon/checked.png) -1px -2px no-repeat;
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
</style>


