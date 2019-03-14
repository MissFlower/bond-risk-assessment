import Vue from 'vue'
import Router from 'vue-router'
import tkSecurityIndex from '@/components/tkSecurityIndex'
import riskBaseInfo from '@/components/riskBaseInfo'
import combinationEvaluationModel from '@/components/combinationEvaluationModel'
import tkGradeType from '@/components/tkBondClassification/tkGradeType'
import tkCompanyType from '@/components/tkBondClassification/tkCompanyType'
import tkRateType from '@/components/tkBondClassification/tkRateType'
import uploadDocument from '@/components/uploadDocument'


Vue.use(Router)

export default new Router({

    routes: [
        {
            path: '/',
            name: 'tkSecurityIndex',
            component: tkSecurityIndex,
            meta: {
                title: '债券风险评估'
            }
        },
        {
            path: '/riskInfo',
            name: 'riskBaseInfo',
            component: riskBaseInfo,
        },
        {
            path: '/enterModel',
            name: 'combinationEvaluationModel',
            component: combinationEvaluationModel,
            // redirect: '/enterModel/grade',
            // children: [
            //     {
            //         path: 'grade',
            //         name: 'tkGradeType',
            //         component: tkGradeType, 
            //     },
            //     {
            //         path: 'company',
            //         name: 'tkCompanyType',
            //         component: tkCompanyType,
            //     },
            //     {
            //         path: 'yieldRate',
            //         name: 'tkRateType',
            //         component: tkRateType,
            //     }
            // ]
        },
        {
            path: '/uploadDocument',
            name: 'uploadDocument',
            component: uploadDocument,
        }
    ]
})
