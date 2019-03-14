<template>
    <div class="tk-risk-container w">
        <risk-assessment-header></risk-assessment-header>
        <div class="clearfix">
            <span class="fl tk-vertical-line"></span>
            <p class="tk-risk-baseinfo fs16 fl">基本信息</p>
        </div>
        <div class="tk-risk-baseinfo-box">
            <div class="tk-risk-baseinfo-list">
                <ul class="tk-risk-baseinfo-list-box">
                    <li class="clearfix">
                        <p class="fl tk-risk-type-name tk-risk-type-first fs14 tr">上市公司</p>
                        <span class="fl tk-risk-type-val fs14">{{baseInfo.quotedCompany}}</span>
                    </li>
                    <li class="clearfix">
                        <p class="fl tk-risk-type-name tk-risk-type-first fs14 tr">债券代码</p>
                        <span class="fl tk-risk-type-val fs14">{{baseInfo.code}}</span>
                    </li>
                    <li class="clearfix">
                        <p class="fl tk-risk-type-name tk-risk-type-first fs14 tr">票面利率</p>
                        <span class="fl tk-risk-type-val fs14">{{baseInfo.couponRate}}</span>
                    </li>
                    <li class="clearfix">
                        <p class="fl tk-risk-type-name tk-risk-type-first fs14 tr">付息频率</p>
                        <span class="fl tk-risk-type-val fs14">{{baseInfo.interestFrequency}}</span>
                    </li>
                    <li class="clearfix">
                        <p class="fl tk-risk-type-name tk-risk-type-first fs14 tr">利率类型</p>
                        <span class="fl tk-risk-type-val fs14">{{baseInfo.interestType}}</span>
                    </li>
                </ul>
            </div>
            <div class="tk-risk-baseinfo-list">
                <ul class="tk-risk-baseinfo-list-box">
                    <li class="clearfix">
                        <p class="fl tk-risk-type-name tk-risk-type-second fs14 tr">债券发行日期</p>
                        <span class="fl tk-risk-type-val fs14">{{baseInfo.ipoDate}}</span>
                    </li>
                    <li class="clearfix">
                        <p class="fl tk-risk-type-name tk-risk-type-second fs14 tr">债券规模</p>
                        <span class="fl tk-risk-type-val fs14">{{baseInfo.issueAmout}}</span>
                    </li>
                    <li class="clearfix">
                        <p class="fl tk-risk-type-name tk-risk-type-second fs14 tr">到期时间</p>
                        <span class="fl tk-risk-type-val fs14">{{baseInfo.maturituDate}}</span>
                    </li>
                    <li class="clearfix">
                        <p class="fl tk-risk-type-name tk-risk-type-second fs14 tr">发行价格</p>
                        <span class="fl tk-risk-type-val fs14">{{baseInfo.par}}</span>
                    </li>
                    <li class="clearfix">
                        <p class="fl tk-risk-type-name tk-risk-type-second fs14 tr">计息方式</p>
                        <span class="fl tk-risk-type-val fs14">{{baseInfo.paymentType}}</span>
                    </li>
                </ul>
            </div>
            <div class="tk-risk-baseinfo-list">
                <ul class="tk-risk-baseinfo-list-box">
                    <li class="clearfix">
                        <p class="fl tk-risk-type-name tk-risk-type-second fs14 tr">债券评级</p>
                        <span class="fl tk-risk-type-val fs14">{{baseInfo.rateFormer}}</span>
                    </li>
                    <li class="clearfix">
                        <p class="fl tk-risk-type-name tk-risk-type-second fs14 tr">债券主题评级</p>
                        <span class="fl tk-risk-type-val fs14">{{baseInfo.rateIssueFormer}}</span>
                    </li>
                    <li class="clearfix">
                        <p class="fl tk-risk-type-name tk-risk-type-second fs14 tr">债券名称</p>
                        <span class="fl tk-risk-type-val fs14">{{baseInfo.secName}}</span>
                    </li>
                    <li class="clearfix">
                        <p class="fl tk-risk-type-name tk-risk-type-second fs14 tr">最新价</p>
                        <span class="fl tk-risk-type-val fs14">{{baseInfo.pcClose}}</span>
                    </li>
                    <li class="clearfix">
                        <p class="fl tk-risk-type-name tk-risk-type-second fs14 tr">多因子</p>
                        <span class="fl tk-risk-type-val fs14">{{baseInfo.kmvModelRisk}}%</span>
                    </li>
                    <li class="clearfix">
                        <p class="fl tk-risk-type-name tk-risk-type-second fs14 tr">动态违约率</p>
                        <span class="fl tk-risk-type-val fs14">{{baseInfo.mfModeRisk}}%</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="clearfix">
            <span class="fl tk-vertical-line tk-risk-model"></span>
            <p class="tk-risk-baseinfo tk-risk-model fs16 fl">多因子模型历史数据</p>
        </div>
        <div id="multiple-factors" class="myChart"></div>
        <div class="clearfix">
            <span class="fl tk-vertical-line tk-risk-model"></span>
            <p class="tk-risk-baseinfo tk-risk-model fs16 fl">动态模型历史数据</p>
        </div>
        <div id="dynamic" class="myChart"></div>
    </div>
</template>

<script>
import riskAssessmentHeader from './public/riskAssessmentHeader'
export default {
    name: 'riskBaseInfo',
    data() {
        return{
            baseInfo: '', // 基本信息
            kmvData: [], //动态数据
            kmvDate: [], //动态日期
            mfData: [], //多因子数据
            mfDate: [], //多因子日期
        }
    },
    components: {
        riskAssessmentHeader
    },
    mounted() {
        
    },
    activated() {
        // console.log(this.$route.query)
        const name = this.$route.query.name;
        const kmv = this.$route.query.kmv;
        const mf = this.$route.query.mf;
        const grade = this.$route.query.grade;
        // 页面进来重置数据
        this.baseInfo = '';
        this.kmvData = [];
        this.kmvDate = [];
        this.mfData = [];
        this.mfDate = [];
        this.getData(name, kmv, mf, grade);
    },
    methods: {
        // getLocalTime(nS) {
        //     //转换时间格式
        //     var myDate = new Date(nS);  
        //     var year = myDate.getFullYear();  
        //     var month = myDate.getMonth() + 1;  
        //     var day = myDate.getDate();  
        //     return year + '-' + month + '-' + day;  
        // },
        getData(secName, kmvModelRisk, mfModeRisk, grade) {
            this.$Message.loading({
                content: '数据请求发送中...',
                duration: 0
            });
            let data = {
                secName: secName, // 债券名称
                kmvModelRisk: kmvModelRisk, // 动态风险值
                mfModeRisk: mfModeRisk, // 多因子风险值
                rateFormer: grade // 评级
            }
            this.$post('cbond_model/cbonds/queryCbondInfo', data)
                .then((response) => {
                    this.$Message.destroy();
                    if (response.status === 200) {
                        const flag = response.data.status;
                        if (flag == '0') {
                            this.baseInfo = response.data.data;
                            const kmv = response.data.data.kmvModelHistoryList;
                            const mf = response.data.data.mfModelHistoryList;
                            if (kmv) {
                                const kmvLen = kmv.length;
                                for (let i = 0; i < kmvLen; i++) {
                                    const element = kmv[i];
                                    this.kmvData.push(element.riskValue);
                                    this.kmvDate.push(element.date);
                                }
                            }
                            if (mf) {
                                const mfLen = mf.length;
                                for (let i = 0; i < mfLen; i++) {
                                    const element = mf[i];
                                    this.mfData.push(element.riskValue);
                                    this.mfDate.push(element.date);
                                }
                            }
                            this.drawMultipleFactors(this.mfData, this.mfDate);
                            this.drawDynamic(this.kmvData, this.kmvDate);
                        }else{
                            this.$Message.error({
                                content: '操作异常！',
                                duration: 3
                            });
                        }
                    } 
                })
                .catch((err) => {
                    this.$Message.destroy();
                    this.baseInfo = [];
                    console.log(err)
                    this.$Message.error({
                        content: '数据请求失败！',
                        duration: 3
                    });
                })
        },
        drawMultipleFactors(data, date) {
            // 基于准备好的dom，初始化echarts实例
            var myChart = this.$echarts.init(document.getElementById('multiple-factors'));
            // 绘制多因子模型图表
            myChart.setOption({
                tooltip: {
                    trigger: 'axis', //坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用
                    position: function (pt) {
                        return [pt[0], '10%'];
                    }
                },
                title: {
                    // left: 'center',
                    // text: '违约概率',
                },
                toolbox: {
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        restore: {},
                        saveAsImage: {},
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: date
                },
                yAxis: {
                    type: 'value',
                    boundaryGap: [0, '100%'],
                    name: '违约概率(%)',
                    max: function(value) {
                        return 100;
                    }
                },
                dataZoom: [{
                    type: 'inside',
                    start: 0,
                    end: 10
                }, {
                    start: 0,
                    end: 10,
                    handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    handleSize: '80%',
                    handleStyle: {
                        color: '#fff',
                        shadowBlur: 3,
                        shadowColor: 'rgba(0, 0, 0, 0.6)',
                        shadowOffsetX: 2,
                        shadowOffsetY: 2
                    }
                }],
                series: [
                    {
                        name:'违约概率',
                        type:'line',
                        smooth:true,
                        symbol: 'none',
                        sampling: 'average',
                        itemStyle: {
                            color: 'rgb(255, 70, 131)'
                        },
                        areaStyle: {
                            color: this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgb(255, 158, 68)'
                            }, {
                                offset: 1,
                                color: 'rgb(255, 70, 131)'
                            }])
                        },
                        data: data
                    }
                ]
            });
        },
        drawDynamic(data, date) {
            // 基于准备好的dom，初始化echarts实例
            var myChart = this.$echarts.init(document.getElementById('dynamic'));

            // 绘制动态模型图表
            myChart.setOption({
                tooltip: {
                    trigger: 'axis', //坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用
                    position: function (pt) {
                        return [pt[0], '10%'];
                    }
                },
                title: {
                    // left: 'center',
                    // text: '收益率',
                },
                toolbox: {
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        restore: {},
                        saveAsImage: {},
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: date
                },
                yAxis: {
                    type: 'value',
                    boundaryGap: [0, '100%'],
                    name: '违约概率(%)',
                    max: 100
                },
                dataZoom: [{
                    type: 'inside',
                    start: 0,
                    end: 10
                }, {
                    start: 0,
                    end: 10,
                    handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    handleSize: '80%',
                    handleStyle: {
                        color: '#fff',
                        shadowBlur: 3,
                        shadowColor: 'rgba(0, 0, 0, 0.6)',
                        shadowOffsetX: 2,
                        shadowOffsetY: 2
                    }
                }],
                series: [
                    {
                        name:'动态数据',
                        type:'line',
                        smooth:true,
                        symbol: 'none',
                        sampling: 'average',
                        itemStyle: {
                            color: 'rgb(255, 70, 131)'
                        },
                        areaStyle: {
                            color: this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgb(255, 158, 68)'
                            }, {
                                offset: 1,
                                color: 'rgb(255, 70, 131)'
                            }])
                        },
                        data: data
                    }
                ]
            });
        }
    }
}
</script>

<style scoped>
    .tk-risk-container {
        background-color: #f6f7fb;
        padding-bottom: 50px
    }
    .tk-vertical-line {
        width: 4px;
        height: 17px;
        background-color: #404768;
        margin: 29px 0 12px 20px
    }
    .tk-risk-baseinfo {
        height: 18px;
        line-height: 18px;
        color: #454c6c;
        margin: 29px 0 12px 12px;
    }
    .tk-risk-model {
        margin-top: 33px;
    }
    .tk-risk-baseinfo-box {
        display: -webkit-flex; /* Safari */
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-around;
        margin: 0 10px;
    }
    .tk-risk-baseinfo-list {
        flex-direction: column;
        flex: 1;
        height: 225px;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0 0 10px #eeeeee;
        margin: 0 10px;
    }
    .tk-risk-baseinfo-list-box {
        margin-top: 22px;
    }
    .tk-risk-type-first {
        width: 77px;
    }
    .tk-risk-type-second,.tk-risk-type-third  {
        width: 104px;
    }
    .tk-risk-type-name {
        height: 30px;
        line-height: 30px;
        color: #8d91a5;
        margin-right: 14px;
    }
    .tk-risk-type-val {
        height: 30px;
        line-height: 30px;
        color: #4c5271;
    }
    .myChart {
        margin: 0 20px;
        background-color: #ffffff;
        height: 300px;
    }
</style>


