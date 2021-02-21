<script>
    export let img_alt;
    export let img_src;
    export let ref = '';
</script>

<style>
    h1 {
        display: flex;
        margin: 3px;
        font-size: 21px;
    }

    img {
        height: 45px;
        padding-right: 4px;
        flex: none;
    }

    .title {
        flex-grow: 1;
    }

    .img-ref {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .ref {
        color: rgb(90, 90, 150);
        font-family: mono;
        font-size: 16px
    }
</style>

<h1>
    <div class="title"><slot></slot></div>
    <div class="img-ref">
        <img alt={img_alt} src={img_src} />
        <div class="ref">{ref}</div>
    </div>
</h1>

