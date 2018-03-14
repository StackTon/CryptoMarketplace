pragma solidity ^0.4.21;

import "./Ownable.sol";
import "./SafeMath.sol";

/// @title A decentilize marketplace
/// @author Alex Stanoev
/// @notice You can use this contract for buying and selling items
/// @dev store product in mapping of Product
contract CryptoMarketpace is Ownable {
    using SafeMath for uint;
    
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
    
    /// @author Alex Stanoev
    /// @notice Buy products by ID
    /// @dev subtraction quantity form products and add it to a soldProducts
    /// @param ID of a product
    /// @param quantity of a product
    function buy(bytes32 ID, uint quantity) public payable {}
    
    /// @author Alex Stanoev
    /// @notice update product quantity by ID
    /// @dev check if index is valid and replace the old quantity with the newQuantity
    /// @param ID of a product
    /// @param newQuantity of a product
    function update(bytes32 ID, uint newQuantity) public {}
    
    //creates a new product and returns its ID
    /// @author Alex Stanoev
    /// @notice add new product
    /// @dev create new product and then push it in the products mapping
    /// @param name of a product
    /// @param price of a product
    /// @param quantity of a product
    /// @return ID of a product
    function newProduct(string name, uint price, uint quantity) public returns(bytes32) {}
    
    /// @author Alex Stanoev
    /// @notice get product by ID
    /// @dev check if product id is valid
    /// @param ID of a product
    /// @return name of a product
    /// @return price of a product
    /// @return quantity of a product
    function getProduct(bytes32 ID) public view returns(string name, uint price, uint quantity) {}
    
    /// @author Alex Stanoev
    /// @notice get all products IDs
    /// @dev -
    /// @return array of bytes32 with all products IDs
    function getProducts() public view returns(bytes32[]) {}
    
    /// @author Alex Stanoev
    /// @notice get product price by ID
    /// @dev check if product id is valid
    /// @param ID of a product
    /// @param quantity of a product
    /// @return price of a product
    function getPrice(bytes32 ID, uint quantity) public view returns (uint) {}
    
    /// @author Alex Stanoev
    /// @notice withdrawal all contract money to owner
    /// @dev -
    function withdrawalMoney() public {}
}