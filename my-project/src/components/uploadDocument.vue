<template>
    <div class="tk-container w">
        <risk-assessment-header></risk-assessment-header>
        <div class="clearfix">
            <span class="fl tk-vertical-line"></span>
            <p class="fl tk-upload-name fs16">上传文档</p>
        </div>
        <div class="tk-upload-box clearfix">
            <div class="fl tk-upload-show-input">
                <Input v-model="fileValue" readonly style="width: 530px" />
            </div>
            <div class="tk-upload-browse-btn tc fl fs18">
                <input type="file" ref="filElem" class="tk-upload-file-input" title="" @change="getFile">
                <span class="tk-upload-browse-text" @click="choiceFile">浏览</span>
            </div>
            <span class="tk-upload-btn fl tc fs18" @click="uploadFlie">上传</span>
        </div>
        <div class="clearfix">
            <span class="fl tk-vertical-line"></span>
            <p class="fl tk-upload-name fs16">对应债券</p>
        </div>
        <div class="tk-bond-content-box">
            <div class="clearfix tc tk-date-box fs16">
                <span class="fl">时间:</span>
                <span class="fl tk-data-val">{{ date }}</span>
            </div>
            <ul class="tk-bond-type-box">
                <li class="tk-bond-type-list fs16">债券名称</li>
                <li class="tk-bond-type-list tc fs16">原有评级</li>
                <li class="tk-bond-type-list tc fs16">现有评级</li>
                <li class="tk-bond-type-list tc fs16">原有违约率</li>
                <li class="tk-bond-type-list tkbond-type-specil-list tc fs16">
                    <span class="">现有违约率</span>
                    <div class="tk-triangle-box">
                        <span class="tk-positive-triangle" :class="[isActive ? 'tk-triangle-up-active' : '']" @click="ascendingOrder"></span>
                        <span class="tk-Inverted-triangle" :class="[isActive ? '' : 'tk-triangle-down-active']" @click="descendingOrder"></span>
                    </div>
                </li>
            </ul>
            <ul class="tk-bond-content">
                <li class="tk-bond-list " v-for="(item, index) in bondInfoLists" :key="index">
                    <div class="tk-bond-infor-list fs14">{{ item.secName }}</div>
                    <div class="tk-bond-infor-list tc fs14">{{ item.previousRating }}</div>
                    <div class="tk-bond-infor-list tk-bond-specil-color tc fs14">
                        <span>{{ item.newRating }}</span>
                        <span class="tk-bond-specil-up-icon-box" :class="[item.rinewRatingAscDesc == 'ASC' ? 'tk-bond-specil-up-icon' : '', item.rinewRatingAscDesc == 'DESC' ? 'tk-bond-specil-down-icon' : '']"></span>
                    </div>
                    <div class="tk-bond-infor-list tc fs14">{{ item.previousDefaultrate }}</div>
                    <div class="tk-bond-infor-list tk-bond-specil-list tc fs14">
                        <span>{{ item.defaultrate }}</span>
                        <span class="tk-bond-specil-down-icon-box" :class="[item.defaultrateAscDesc == 'ASC' ? 'tk-bond-specil-up-icon' : '', item.defaultrateAscDesc == 'DESC' ? 'tk-bond-specil-down-icon' : '']"></span>
                    </div>
                </li>
            </ul>
            <div class="tc" :class="[totalPage > 1 ? 'show' : 'hide']">
                <div class="tk-page-box">
                    <Page :total="total" :current="currentPage" class-name="tk-cut-page" :page-size="12" :page-size-opts="[12,16,20]" show-total show-elevator show-sizer @on-change="changePage" @on-page-size-change="changePageSize"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import riskAssessmentHeader from './public/riskAssessmentHeader'
export default {
    name: 'uploadDocument',
    data() {
        return{
            isActive: true,
            bondInfoLists: [], //对应债券数据
            total: 0, //共多少条数据
            totalPage: 1, //共多少页
            pageNum: 1, // 第几页  默认第一页
            pageSize: 12, // 一页展示多少条 默认12条
            currentPage: 1, // 当前页面时第几页
            orderBy: 'asc', // asc代表升序 desc代表降序
            repeatClickFlag: false, // 防止重复点击
            fileValue: '', // 上传文件的名称
            date: '', // 时间
        }
    },
    components: {
        riskAssessmentHeader
    },
    mounted() {
        const that = this;
    },
    methods: {
        getData() {
            const that = this;
            that.$Message.loading({
                content: '数据请求发送中...',
                duration: 0
            });
            let data = {
                orderBy: that.orderBy,
                pageNum: that.currentPage,
                pageSize: that.pageSize
            }
            that.$post('cbondModel/cbonds/queryBondRating', data)
                .then((response) => {
                    that.$Message.destroy();
                    if (response.status === 200) {
                        const status = response.data.status;
                        if (status == '0') {
                            const data = response.data.data.list;
                            const pageData = response.data.data.page;
                            that.date = response.data.data.list[0].date;
                            that.bondInfoLists = data;
                            that.total = pageData.totalResult;
                            that.totalPage = pageData.totalPage;
                        }else if(res.status == '1') {
                            that.$Message.error({
                                content: '数据请求失败！',
                                duration: 3
                            });
                        }
                    }
                    that.repeatClickFlag = true;
                })
                .catch((error) => {
                    that.$Message.destroy();
                    console.log(error)
                    that.$Message.error({
                        content: '数据请求失败！',
                        duration: 3
                    });
                    that.repeatClickFlag = true;
                })
        },
        ascendingOrder() {
            // 升序
            const that = this;
            if (that.repeatClickFlag) {
                if (!that.isActive) {
                    that.currentPage = 1;
                    that.isActive = true;
                    that.orderBy = 'asc';
                    that.repeatClickFlag = false;
                    that.getData();
                }
            }
        },
        descendingOrder() {
            // 降序
            const that = this;
            if (that.repeatClickFlag) {
                if (!that.isActive) {
                    that.currentPage = 1;
                    that.isActive = false;
                    that.orderBy = 'desc';
                    that.repeatClickFlag = false;
                    that.getData();
                }
            }
        },
        changePage(index) {
            // 页码改变
            const that = this;
            if (that.repeatClickFlag) {
                that.repeatClickFlag = false;
                that.getData();
            }
        },
        changePageSize(index) {
            // 页面展示条数改变
            const that = this;
            that.currentPage = 1;
            that.pageSize = index;
        },
        choiceFile() {
            const that = this;
            that.$refs.filElem.dispatchEvent(new MouseEvent('click'));
        },
        getFile() {
            const that = this;
            const inputFile = that.$refs.filElem.files[0];
            console.log(inputFile)
            that.fileValue = inputFile.name
        },
        uploadFlie() {
            const that = this;
            // let inputFile = that.$refs.filElem.files[0];
            if (that.fileValue) {
                that.$Message.loading({
                    content: '文件上传中...',
                    duration: 0
                }); 
                let Timer = setTimeout(() => {
                    that.$Message.destroy();
                    that.$Message.success({
                        content: '文件上传成功！',
                        duration: 3
                    }); 
                    that.fileValue = '';
                    that.getData();
                    clearTimeout(Timer);
                },2000)
            }else{
                that.$Message.warning({
                    content: '请您先选择需要上传的文件！',
                    duration: 3
                }); 
            }
        }
    }
}
</script>

<style scoped>
    .tk-container{
        background-color: #f6f7fb;
        padding-bottom: 50px;
    }
    .tk-vertical-line {
        width: 4px;
        height: 17px;
        background-color: #404768;
        margin: 42px 0 12px 20px
    }
    .tk-upload-name {
        color: #2e3659;
        height: 42px;
        line-height: 42px;
        margin-top: 30px;
        margin-left: 16px;
    }
    .tk-upload-box {
        width: calc(100% - 40px);
        margin: 0 auto;
        height: 120px;
        line-height: 120px;
        background-color: #ffffff;
        -webkit-border-radius-left-top: 5px;
        -moz-border-radius: 5px;
        -ms-border-radius: 5px;
        -o-border-radius: 5px;
        border-radius: 5px;
        -webkit-box-shadow: 0 0 10px #eaeaea;
        -moz-box-shadow: 0 0 10px #eaeaea;
        -ms-box-shadow: 0 0 10px #eaeaea;
        -o-box-shadow: 0 0 10px #eaeaea;
        box-shadow: 0 0 10px #eaeaea;
    }
    .tk-upload-show-input {
        margin-left: 73px;
        width: 530px;
    }
    .tk-upload-browse-btn {
        width: 134px;
        height: 45px;
        line-height: 45px;
        color: #0a133d;
        margin-top: 38px;
        cursor: pointer;
        background-color: #dddee5;
        position: relative;
    }
    .tk-upload-browse-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        color: #404768;
    }
    .tk-upload-file-input {
        display: none;
        width: 100%;
        cursor: pointer;
    }
    .tk-upload-btn {
        width: 134px;
        height: 45px;
        line-height: 45px;
        background-color: #094c8e;
        color: #ffffff;
        margin-top: 38px;
        margin-left: 23px;
        cursor: pointer;
    }
    .tk-bond-content-box {
        width: calc(100% - 40px);
        margin: 0 auto;
        background-color: #ffffff;
        padding: 0 20px;
    }
    .tk-date-box {
        height: 60px;
        line-height: 60px;
        color: #a2a7b5;
        margin-top: 15px;
    }
    .tk-data-val {
        margin-left: 5px;
    }
    .tk-bond-type-box {
        -webkit-display: flex;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        flex-direction: row;
        background-color: #f6f7fb;
    }
    .tk-bond-type-list {
        flex: 1;
        color: #363e62;
        height: 60px;
        line-height: 60px;
    }
    .tk-bond-type-list:first-child {
        padding-left: 10px;
    }
    .tk-bond-content {
        min-height: 400px;
    }
    .tk-bond-list {
        -webkit-display: flex;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        flex-direction: row;
        border-bottom: 1px dashed #e7e8ed;
    }
    .tk-bond-infor-list {
        flex: 1;
        height: 56px;
        line-height: 56px;
    }
    .tk-bond-list .tk-bond-infor-list:first-child {
        padding-left: 10px;
    }
    .tk-bond-specil-color {
        color: #fe5609;
        position: relative;
    }
    .tk-bond-specil-up-icon-box {
        width: 16px;
        height: 21px;
        position: absolute;
        top: 30%;
        right: 30%;
    }
    .tk-bond-specil-down-icon-box {
        width: 16px;
        height: 21px;
        position: absolute;
        top: 30%;
        right: 23%;
    }
    .tk-bond-specil-up-icon {
        background: url(../assets/icon/gradeUp.png) 0 0 no-repeat;
    }
    .tk-bond-specil-down-icon {
        background: url(../assets/icon/gradeDown.png) 0 0 no-repeat;
    }
    .tkbond-type-specil-list,.tk-bond-specil-list {
        position: relative;
    }
    .tk-triangle-box {
        position: absolute;
        width: 16px;
        height: 20px;
        top: 30%;
        right: 24%;
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
    .tk-page-box {
        height: 100px;
        line-height: 100px;
        display: inline-block;
    }
    .ivu-btn {
        width: 134px;
        height: 45px;
        line-height: 45px;
        -webkit-border-radius: 0;
        -moz-border-radius: 0;
        -ms-border-radius: 0;
        -o-border-radius: 0;
        border-radius: 0;
    }
    /* .ivu-btn-icon-only {
        border-top-right-radius: 0px;
        border-bottom-right-radius: 0px;
    } */
</style>
<style>
    .tk-upload-box .ivu-icon {
        margin-bottom: 10px;
    }
    .tk-upload-box .ivu-btn>span {
        display: block;
        width: 100%;
    }
    .tk-upload-box .ivu-input {
        height: 45px;
        border-top-right-radius: 0px;
        border-bottom-right-radius: 0px;
    }
</style>


