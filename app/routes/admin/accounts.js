const express = require("express");
const router = express.Router();
const uuid = require('uuid');

const AccountsList = require("../../models/properties").AccountsList;

router.get("/", async (req, res) => {  
  res.renderEjs(req, "accounting/list", {
    page_title: "Accounts List",
    sub_header: "Available Accounts"     
  });   
});

router.get("/history/:id", async (req, res, next) => {
  res.renderEjs(req, "accounting/account-history", {
    page_title: "Account transactions history",
    sub_header: "Account History"     
  }); 
});

router.post("/", async (req, res) => {  
    let loader = await new AccountsList();
    loader.where_data = 'user_code = "'+ req.session.user_code +'" ';
    let data = await loader.all(req.body);  
    res.json(data);   
});

router.post("/new", async (req, res) => {  
  let acc = {
    account_id:uuid.v4(),
    account_type: req.body.account_type,
    account_name: req.body.account_name,
    account_no: req.body.account_no,
    branch_name: req.body.branch_name,
    bank_name: req.body.bank_name,
    opening_balance: req.body.opening_balance,
    payment_instructions: req.body.payment_instructions,
    user_code: req.session.user_code,
  };
  let added = await AccountsList.add(acc);
  if(added){
    res.successEnd("A new account has been added!");
  }else{
    res.errorEnd("Unable to add a new account. Please check your values and try again!");
  }     
});

router.post("/update", async (req, res) => { 
  let acc = {   
    account_type: req.body.account_type,
    account_name: req.body.account_name,
    account_no: req.body.account_no,
    branch_name: req.body.branch_name,
    bank_name: req.body.bank_name,  
    payment_instructions: req.body.payment_instructions  
  };
  let updated = await AccountsList.update(acc, req.body.account_id);
  if(updated){
    res.successEnd(`The selected account has been updated.`);
  }else{
    res.errorEnd(`Unable to update account details! Please try again later.`);
  } 
});

router.post("/info", async (req, res) => { 
  let info = await AccountsList.get(req.body.account_id);
  res.successEnd(info);
});

router.post("/delete", async (req, res) => { 
  let deleted = await AccountsList.delete(req.body.account_id);
  if(deleted){
    res.successEnd(`The selected account has been deleetd.`);
  }else{
    res.errorEnd(`Unable to delete the selected account. Only accounts that have not been used can be deleted!`);
  } 
});

router.post("/change-status", async (req, res) => { 
  let d={is_active:req.body.is_active};
  let updated = await AccountsList.update(d, req.body.account_id);
  let status = 'activated';
  if(req.body.is_active){
      status = 'deactivated';
  }
  if(updated){
    res.successEnd(`The selected account has been ${status}.`);
  }else{
    res.errorEnd(`Selected account not ${status}! Please try again later.`);
  } 
});

router.post("/list", async (req, res) => { 
  let list = await AccountsList.list(req.session.user_code);
  res.successEnd(list);
});

  module.exports = router;