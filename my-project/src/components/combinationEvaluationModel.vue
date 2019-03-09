<template>
    <div class="tk-container w">
        <risk-assessment-header></risk-assessment-header>
        <div class="clearfix tk-cem-content">
            <div class="fl tk-cem-left">
                <Tabs value="grade" @on-click="changeType">
                    <TabPane label="评级" name="grade">
                        <ul class="clearfix tk-grade-box">
                            <li class="tk-grade-list fs14 tc fl" :class="[currentGradeIndex == index ? 'tk-grade-list-active' : '']" v-for="(gradeNameList, index) in gradeLists" :key="index" @click="gradeEvent(index, gradeNameList)">{{ gradeNameList }}</li>
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
                <router-view></router-view>
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
            currentRateName: '0-10%',
            gradeLists: ['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC', 'CC', 'C', 'D'],
            companyLists: ['泰康', '联合信用评级有限公司', '中诚信证券评估有限公司', '大公国际资信评估有限公司', '中证鹏元资信评估股份有限公司', '上海新世纪资信评估投资服务有限公司', '东方金诚国际信用评估有限公司', '远东资信评估有限公司', '标准普尔评级服务公司'],
            yieldRatelists: ['<0', '0~4%', '4%~8%', '8%~10%', '>=10%'],
            currentType: 'grade',
        }   
    },
    components: {
        riskAssessmentHeader
    },
    mounted() {
        this.$router.push({
            path: '/enterModel/grade',
        })
    },
    methods: {
        changeType(val) {
            console.log(val)
            if (val == this.currentType) {
                return false;
            }
            this.$router.push({
                path: '/enterModel/'+ val
            })
            this.currentType = val
        },
        gradeEvent(index, gradeNameList) {
            // 获取评级
            this.currentGradeIndex = index;
            this.currentGradeName = gradeNameList;
            console.log(gradeNameList)
            this.$router.push({
                path: '/enterModel/grade',
                query: {
                    gradeVal: gradeNameList
                }
            })
        },
        getCompany(index, companyName) {
            // 获取公司
            console.log(index, companyName)
            this.currentCompanyIndex = index;
            this.currentCompanyName = companyName;
            
        },
        getYieldRate(index, yieldRate) {
            // 获取收益率
            this.currentRateIndex = index;
            this.currentRateName = yieldRate;
            console.log(yieldRate)
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
    .tk-grade-list {
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
    .tk-grade-list-active {
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
</style>



