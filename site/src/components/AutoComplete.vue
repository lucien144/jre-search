<template>
    <div class="autocomplete">
        <input
            type="text"
            placeholder="Elon Musk"
            v-model="keyword"
            @keyup="search" />
        <ul class="results">
            <li v-for="result in data" :key="result._id">{{ result.original }} <span>{{ result.count }}</span></li>
        </ul>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data () {
        return {
            keyword: '',
            data: {}
        };
    },
    methods: {
        async search () {
            if (this.keyword === 0) {
                this.data = {};
                return;
            }

            const {data} = await axios.get(`http://localhost:8000/hosts?search=${this.keyword}`);
            this.data = data.data;
        }
    }
}
</script>

<style scoped lang=less>
    input {
        width: 100%;
        padding: 1rem;
        outline: none;
        border: 15px solid #FFE94C;
        color: #1D18F5;
        line-height: 3.5rem;
        font-size: 3.2rem;
        font-weight: 800;
        &::placeholder {
            color: fade(#1D18F5, 10);
            line-height: 3.5rem;
            font-size: 3.2rem;
        }
    }
    .results {
        width: 100%;
        list-style: none;
        padding: 0 1rem;
        background-color: #FFE94C;
        li {
            display: flex;
            justify-content: space-between;
            width: 100%;
            padding: 1rem;
            color: #1D18F5;
            border-bottom: 1px dashed #1D18F5;
            background-color: #FFE94C;
            font-size: 1.5rem;
            font-weight: 800;
            text-align: left;
            &:last-of-type {
                border-bottom: none;
            }
            span {
                padding: 0 .5rem;
                color: #FFE94C;
                background-color: #1D18F5;
            }
        }
    }
</style>
