<script>
    export let img_alt;
    export let img_src;
    export let title;
</script>

<style>
    h3 {
        padding-top: 5px;
    }

    img {
        height: 45px
    }
</style>

<h3>
    <img alt={img_alt} src={img_src} />
    {title}
</h3>

