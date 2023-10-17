const db = require("../models");

const commonMethod = {}


commonMethod.getDiscount = async (_cartValue) => {
    try {
        const _courseID = _cartValue.courseID;
        const calculatedValue = {
            discountPrice: 0,
            discountPercentage: 0,
            tltPrice: 0,
            cartValueTlt: 0
        }
        const courseProduct = {
            subCount: 0,
            testCount: 0,
            liveCount:0
        }

        let totalCartCount = _cartValue.subjectList.length + _cartValue.testSeriesList.length + _cartValue.liveClassList.length;
        if (totalCartCount == 0) {
            return calculatedValue;
        }

        const discountTbl = await db.Discount.findOne({ courseID: _courseID });
        if (!discountTbl) {
            return calculatedValue;
        }
        //TODO add , isActive: '1' 
        courseProduct.testCount = await db.TestSeries.countDocuments({ courseID: _courseID , isActive: '1' });
        courseProduct.subCount = await db.Subject.countDocuments({ courseID: _courseID , isActive: '1' });
        courseProduct.liveCount = await db.LiveClass.countDocuments({ courseID: _courseID , isActive: '1' });
        let totalProductCount = courseProduct.subCount + courseProduct.testCount + courseProduct.liveCount;

     

        if (totalCartCount == totalProductCount) {
            if (discountTbl.allSub) calculatedValue.discountPercentage = discountTbl.allSub;
        } else if (totalCartCount > 1) {
            if (discountTbl.moreSub) calculatedValue.discountPercentage = discountTbl.moreSub;
        } else if (totalCartCount == 1) {
            //single discount
            if (discountTbl.oneSub) calculatedValue.discountPercentage = discountTbl.oneSub;
        }


        _cartValue.subjectList.forEach(element => {
            calculatedValue.cartValueTlt += element.selectedPlan.amount
        });
        _cartValue.testSeriesList.forEach(element => {
            calculatedValue.cartValueTlt += element.selectedPlan.amount
        });
        _cartValue.liveClassList.forEach(element => {
            calculatedValue.cartValueTlt += element.selectedPlan.amount
        });

        calculatedValue.discountPrice = (calculatedValue.cartValueTlt * (calculatedValue.discountPercentage / 100)).toFixed(2);;
        calculatedValue.tltPrice = calculatedValue.cartValueTlt - calculatedValue.discountPrice;

        return calculatedValue;

    } catch (error) {
        throw error;
    }
}

module.exports = commonMethod