pragma solidity ^0.4.18;

import "./Ownable.sol";
import "./SafeMath.sol";

/// @title A decentilize marketplace
/// @author Alex Stanoev
/// @notice You can use this contract for buying and selling items
/// @dev store product in mapping of Product
contract CryptoMarketplace is Ownable {
    using SafeMath for uint;
    
    event NewProduct(bytes32 indexed ID, string name, uint price, uint quantity, address owner);
    event BuyProduct(bytes32 indexed ID, uint quantity, uint value, address buyer);
    event UpdateProduct(bytes32 indexed ID, uint NewProduct, address owner);
    event WithdrawalMoney(address indexed owner, uint amount);
    
    struct Product {
        string name;
        uint price;
        uint quantity;
    }
    
    // hold mapping Index - Product
    mapping(bytes32 => Product) private products;
    
    // hold mapping address - sold product 
    //mapping(address => Product[]) private soldProducts;
    
    // hold indexes of all products
    bytes32[] private productIDs;
    
    modifier onlyValidProduct(bytes32 ID) {
        // check if the product is greter then zero
        require(products[ID].price > 0);
        _;
    }
    
    /// @author Alex Stanoev
    /// @notice Buy products by ID
    /// @dev subtraction quantity form products and add it to a soldProducts
    /// @param ID of a product
    /// @param quantity of a product
    function buy(bytes32 ID, uint quantity) public payable onlyValidProduct(ID) {
        
        // check if quantity is greter the zero
        require(quantity > 0);
        
        // check if product quantity is greter or equal then quantity param
        require(products[ID].quantity >= quantity);
        
        // inicialize totalPrice variable that with contain how much it cost to buy product
        uint totalPrice = getPrice(ID, quantity);
        
        // check if send wai are greter or equal then totalPrice
        require(msg.value >= totalPrice);
        
        // subtract product quantity by quantity param
        products[ID].quantity = products[ID].quantity.sub(quantity);
        
        // execute BuyProduct event
        BuyProduct(ID, quantity, totalPrice, msg.sender);
    }
    
    /// @author Alex Stanoev
    /// @notice update product quantity by ID
    /// @dev check if index is valid and replace the old quantity with the newQuantity
    /// @param ID of a product
    /// @param newQuantity of a product
    function update(bytes32 ID, uint newQuantity) public onlyValidProduct(ID) onlyOwner {
        
        // check if newQuantity param is different then current product quantity
        require(newQuantity != products[ID].quantity);
        
        // set product quantity to be equal to newQuantity param
        products[ID].quantity = newQuantity;
        
        // execute event UpdateProduct
        UpdateProduct(ID, newQuantity, msg.sender);
    }
    
    /// @author Alex Stanoev
    /// @notice add new product
    /// @dev create new product and then push it in the products mapping
    /// @param newID of a product
    /// @param name of a product
    /// @param price of a product
    /// @param quantity of a product
    /// @return newID of a product
    function newProduct(bytes32 newID, string name, uint price, uint quantity) public onlyOwner returns(bytes32) {
        
        // check if name param is empty
        require(bytes(name).length > 0);
        
        // check if price is greter then zero
        require(price > 0);
        
        // check if quantity is greter then zero
        require(quantity > 0);
        
        // check if there is product with this newID
        require(products[newID].price == 0);
        
        // make and add new product to the products mapping newID => Product
        products[newID] = Product(name, price, quantity);
        
        // push then newID in the productIDs array
        productIDs.push(newID);
        
        // execute event NewProduct
        NewProduct(newID, name, price, quantity, owner);
        
        return newID;
    }
    
    /// @author Alex Stanoev
    /// @notice get product by ID
    /// @dev check if product id is valid
    /// @param ID of a product
    /// @return name of a product
    /// @return price of a product
    /// @return quantity of a product
    function getProduct(bytes32 ID) public view onlyValidProduct(ID) returns(string, uint, uint) {
        return (products[ID].name, products[ID].price, products[ID].quantity);
    }
    
    /// @author Alex Stanoev
    /// @notice get all products IDs
    /// @dev -
    /// @return array of bytes32 with all products IDs
    function getProducts() public view returns(bytes32[]) {
        return productIDs;
    }
    
    /// @author Alex Stanoev
    /// @notice get product price by ID
    /// @dev check if product id is valid
    /// @param ID of a product
    /// @param quantity of a product
    /// @return price of a product
    function getPrice(bytes32 ID, uint quantity) public view onlyValidProduct(ID) returns (uint) {
        return products[ID].price.mul(quantity);
    }
    
    /// @author Alex Stanoev
    /// @notice withdrawal all contract money to owner
    function withdrawalMoney() public onlyOwner {
        
        // declarete balance variable that will hold contract balance
        uint balance = this.balance;
        
        // check if balance is more then zero
        require(balance > 0);
        
        // transfer all contract balance to the owner of the contract
        owner.transfer(balance);
        
        // execute event WithdrawalMoney
        WithdrawalMoney(msg.sender, balance);
    }
	
    
    /// @author Alex Stanoev
    /// @return contract balance
	function getContractBalance() public view onlyOwner returns(uint) {
        return this.balance;
    }
}