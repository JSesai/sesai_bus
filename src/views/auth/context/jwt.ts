import * as jose from "jose";

// Cargar las llaves
const LlavePrivadaCambioNIP = "BwIAAACkAABSU0EyAAgAAAEAAQC9aTxMX3jaks1hA+QwgrDtP4nAJbB+TvUb7UawqIPJU+7RWxXwmy3n+5fIqn8SluyjAIwtXWHnOm+6vmFoZ/qAGZ6kehGMypx2esmi9elwZdRG+wVkyKm8VFWanA7RfD+zrUmtxFqwOE03WLkdOJ6D8oP8Quvu8M8YXHjdBJXj/URYFgsO8ArwsF17OgHNud6potEaCOQP4kmTAs+M2Fu2TUGZkO76IR/HSQA9/HqWGBduEKz64kxfEIDkvTsvXg9UjxHS3Xh4akkRFhlKo/NE64nw2jqkDcezG7MG7rebfHXzbnD0G83VfZ9n1t49LygBoUEMNm57G36u8DVMTCfFeSFLBdAw0Xla0H7+rbYeLQeuNY2TdII5/6GqmmXxdtUfeMnj01i6JXeusCs+VWazCVIq6ySdGyIT3X5abU7JeW63BPH2FyjSjhJaZiNhtGh8rDehsH7z+lAmMLMTeZ9TZEibTTbir7b8pny0UlfHi9IkbOztrLNIjAyBlRxdxPJlnVm3kgAnXqiz7dB9aTSeO5uvjNkT/GfvtI6jQ0czIdAZWFuy2DZ4SeoWWm2ERXy89djsuWddkeRsFEqkcAolcOMwhPb97XuwSG8Kpc5rVhKD+f8m/QnON+mh+xOhB8y7VWqk93iCsGep9zaAb30RnsUxTRy2SSgaexvjSW7mz2EbfAVWwfKKvqXJSJPv/L441a+AIDgl13Tw/3VB9rKxJCQmMLaXdQzp6JEB/hPgWjRDa2aaC5OFOUl82zrYz59tE/hKzS72MbIS2SNY4eTYpAIs299EYwS9x55Wo+5VwBaZ7RR7cs2wm4ItF2KfUsx3RNqwu0v8lkJ6KRaiT+Z1kRYkhC4fQRH5AwcNJK7KTQ7ZNNhDUlTHEhTdUdOXQglvdmWAHL88eD6F9XMNPwD/kU+yaiXUcDCUF09MK3GQyCSGDBX9HfVoYVbVNmSYsK2okgaPVN3xMD4rvSz9Q27xjMUUBon/LzfMjXzw3rRBmQ3jaTpb52iW45XCYwe40xsAhpm5BC6HAMK2bHXivD1FqEDEWiItyW7W/Sn5bYqrpSkHdqSLPpqczTF5JhCjGpa2b2n4N5V7xVESU3jz36uOhHXjZhJ2gDx/fZGugOOGV8ctszpyaULW9tzjtc2ClZUYY3H63z6kv3fLSWu6vj9ThhWq40RHjmnRgaseu7BJijm8IqqNvddQ8hkp9r44gb0dsEkV2p0L1oDbaTtNIDUtnyqMUjzBBx/1v4SPNtFqtqWTJjvJfJF9wSW6YPEKowSHna/qY78w3za/ePmKTEBoggAXAoDUHv+cD9FKQ9Icykjg7kpLF16WkxNYc94EHet6WkqLwyB398jjxv/+YzhkxRUOCApWcR3r95/py/cTQugVMJUKSvl3HVELJ8qQsuVYKsNGdD3ORBx1CKiU0UYCF0rwBOn4SZrBt7Pf7RoXdl0f85fzpD+lTUuBZPbv59ztxQy6ZWOnrrIPbW6MdiB61r8C/R3tWO01BpPMfOhG17CMSrOff2JwRLxd++D/bxo=";
const LlavePublicaCambioNIP = "BgIAAACkAABSU0ExAAgAAAEAAQAFx4WGnnrMHqG/TcimVhMjYojOd0xdHtCc5DaceeFqLuTN6tgBs7mXFPQUMoYK0Zhc67pKNfQgokH2dxUtEOEbGHbzNigAY9rTb4zCOy7UKaaKMmbz5U3dDq8jAR14mQIh1cg0l5k5ca92qHQ17Lcd760jbNu7pEPSp3gZ+rZjRO7pWKv3fUexuZzaSLaANX6s2yGQcvR3G25ixYLseEGDJGHsnkJD/8l8Ce1RCZQ3P4PlvC5n17Zg7HyAWoEgDHpZLjTaGLUZ1BZDSxpmoMGt8J3BQ4tDwThDbmvHukcr8JWW67PxCxj655P7octw6nCyg6mdfrhzh8gTFYGXGwqx";


export const creaToken = async () => {
    try {
        const privateKey = await jose.importPKCS8(LlavePrivadaCambioNIP, "HS256");
        const publicKey = await jose.importSPKI(LlavePublicaCambioNIP, "HS256");
        const jwt = await new jose.SignJWT({ userId: 123 }).setProtectedHeader({ alg: "RS256" }).setIssuedAt().setExpirationTime("1h").sign(privateKey); 
        const { payload } = await jose.jwtVerify(jwt, publicKey); console.log(payload);

    } catch (error) {
        console.log('error al crear token ', error);

    }


}

export const validarToken = async (jwt: string) => {

    // Verificar el token con la clave pública
    try {
        const publicKey = await jose.importSPKI(LlavePublicaCambioNIP, "RS256");
        const { payload } = await jose.jwtVerify(jwt, publicKey);
        console.log("Payload decodificado:", payload);
    } catch (err) {
        console.error("Token inválido:", err);
    }

}
