<template>
    <transition name="fade">
        <div class="container-fluid panel-wrapper m-0 p-4">
            <div class="row m-0 p-0">
                <div class="col m-0 p-0">
                    <div class="querybar">
                        <querytop :controls="false"></querytop>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col col-12">
                    <b-card>
                        <div class="section panel-details">
                            <div class="row section-title">
                                <h3 class="title">Creative Simulation</h3>
                                <h5 class="subtitle">소재요소별 예상효율 확인</h5>
                            </div>
                        </div>
                        <div class="row section-content">
                            <!-- TODO: v-for option tables -->
                            <div class="col-sm-12 col-lg-4">
                            </div>
                        </div>
                        <div class="row section-controls">
                            <div class="col" align="right">
                                <b-button>리셋</b-button>
                                <b-button>예상효율 확인하기</b-button>
                            </div>
                        </div>
                    </b-card>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import querytop from './queryTop';

export default {
    name: 'simulation',
    components: {
        querytop,
    }
}
</script>