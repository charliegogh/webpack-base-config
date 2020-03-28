let api='http://localhost/api'
$.ajax({
    url:api+'/electricityOrder/getSummarizes',
    type:'post',
    success:function (res) {
        console.log(res);
    }
})
