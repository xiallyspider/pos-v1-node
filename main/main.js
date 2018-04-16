

var getCount = function(stringArray){
    let tempArr = []
    stringArray.forEach((type) => {
        if(type.includes('-')){
            let arr = type.split('-')
            let count = parseInt(arr[1])
            for (let x = 0; x < count; x++){
                tempArr.push(arr[0])
            }
        } else {
            tempArr.push(type)
        }
    })
    let result = tempArr.reduce((array,type,index) => {
        let entry = array.find((e) => {
            return e.type === type
        })
        if (entry) {
            entry.count++
        } else {
            array.push({type:type, count:1})
        }
        return array
    },[])
    return result
}

var getPromotionItems = function(objectArray){
    let promotions = loadPromotions()
    let promotionArr = []
    promotions.forEach((promotion) => {
        if (promotion.type === 'BUY_TWO_GET_ONE_FREE') {
            let barcodes = promotion.barcodes
            objectArray.forEach((object) => {
                barcodes.forEach((code) => {
                    if(object.type === code){
                        let count = parseInt(object.count/2)
                        promotionArr.push({type: code, count: count})
                    }
                })
            })
        }
    })
    return promotionArr
}
var getPrice = function(objectArray){
    let resultObjArr = []
    let tempArr = []
    let allItems = loadAllItems()
    let promotions = getPromotionItems(objectArray)
    
    allItems.forEach((item) => {
        objectArray.forEach((object) => {
            if(item.barcode === object.type){
                let price = item.price * object.count
                tempArr.push({type: object.type, count: object.count, price:price})
            }
        })
    })
    tempArr.forEach((object) => {
        let flag = true // 是否把object直接放入
        promotions.forEach((promotion) => {
            if(object.type === promotion.type){
                let singlePrice = object.price/object.count
                let price = object.price - singlePrice
                resultObjArr.push({type: object.type, count: object.count, price:price})
                flag = false
            }
        })
        if(flag){
            let price = object.price
            resultObjArr.push({type: object.type, count: object.count, price:price})
        }
    })
    return resultObjArr
}
var getRestInfo = function(objectArray){
    let result = []
    let allItems = loadAllItems()
    allItems.forEach((item) => {
        objectArray.forEach((object) => {
            if(item.barcode === object.type){
                result.push({name: item.name, unit:item.unit, unitprice:item.price, count: object.count, price:object.price})
            }
        })
    })
    return result
}
module.exports = function main(inputs) {
    let result = ``
    let typeObjArr = getCount(inputs)
    let promotions = getPromotionItems(typeObjArr)
    let priceObjArr = getPrice(typeObjArr)
    let resultObjArr = getRestInfo(priceObjArr)
    promotions = getRestInfo(promotions)
    
    let resultPrice = 0
    let sumPrice = 0
    let promotPrice = 0
    
    result = '***<没钱赚商店>购物清单***\n'
    resultObjArr.forEach((obj) => {
        result += '名称：' + obj.name + '，数量：'+ obj.count + obj.unit + '，单价：'+ obj.unitprice.toFixed(2) + '(元)，小计：'+ obj.price.toFixed(2) +'(元)\n' 
        resultPrice += obj.price
        sumPrice += obj.count * obj.unitprice
    })
    promotPrice = sumPrice - resultPrice
    result += '----------------------\n'+
    '挥泪赠送商品：\n' 
    promotions.forEach((promotion) => {
        result += '名称：' + promotion.name + '，数量：' + promotion.count + promotion.unit + '\n'
    })
    result +=  '----------------------\n' + 
    '总计：' + resultPrice.toFixed(2) + '(元)\n' +
    '节省：' + promotPrice.toFixed(2) + '(元)\n' +
    '**********************'
    console.log(result)
    return result
};
