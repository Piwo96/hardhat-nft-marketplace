// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract BasicNftTwo is ERC721 {
    string public constant TOKEN_URI =
        "ipfs://QmY3VN2pD16rWNewSQXjhZPKBxSQR4CNeRNnSBWVUoZ9kv";
    uint256 private s_tokenCounter;

    event DogMinted(uint256 indexed tokenId);

    constructor() ERC721("Dogie", "DOG") {
        s_tokenCounter = 0;
    }

    function mintNft() public {
        uint256 tokenId = s_tokenCounter;
        s_tokenCounter += 1;
        _safeMint(msg.sender, tokenId);
        emit DogMinted(tokenId);
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        return TOKEN_URI;
    }
}
