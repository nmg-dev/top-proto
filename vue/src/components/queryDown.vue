<template>
    <div class="querybar-down d-flex">
        <subcategory 
            title="Design Type"
            :options="designTypeOptions">
        </subcategory>
        <subcategory 
            title="Message Type"
            :options="messageTypeOptions">
        </subcategory>
    </div>
</template>

<script>
import subcategory from './subcategory';

export default {
    name: 'querydown',
    components: {
        subcategory,
    },
    data: function() {
        return {
            designTypeOptions : [
                {cls: 'layout', title: '레이아웃', onchange: (ev) => {  }},
                {cls: 'background', title: '배경', onchange: (ev) => {  }},
                {cls: 'objet', title: '오브제', onchange: (ev) => {  }},
                {cls: 'button', title: '버튼', onchange: (ev) => {  }},
            ],
            messageTypeOptions : [
                {cls: 'keytopic', title: '주제', onchange: (ev) => {  }},
                {cls: 'keyword', title: '키워드', onchange: (ev) => {  }},
                {cls: 'trigger', title: '트리거', onchange: (ev) => {  }},
                {cls: 'adcopy', title: '카피', onchange: (ev) => {  }},
            ],


        };
    }
}
</script>

<style>
</style>