import Vue from 'vue'
import Router from 'vue-router'
import tkSecurityIndex from '@/components/tkSecurityIndex'
import riskBaseInfo from '@/components/riskBaseInfo'
import combinationEvaluationModel from '@/components/combinationEvaluationModel'
import tkGradeType from '@/components/tkBondClassification/tkGradeType'
import tkCompanyType from '@/components/tkBondClassification/tkCompanyType'
import tkRateType from '@/components/tkBondClassification/tkRateType'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'tkSecurityIndex',
            component: tkSecurityIndex,
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
            redirect: '/enterModel/grade',
            children: [
                {
                    path: '/enterModel/grade',
                    name: 'tkGradeType',
                    component: tkGradeType,  
                },
                {
                    path: '/enterModel/company',
                    name: 'tkCompanyType',
                    component: tkCompanyType,
                },
                {
                    path: '/enterModel/yieldRate',
                    name: 'tkRateType',
                    component: tkRateType,
                }
            ]
        }
    ]
})
