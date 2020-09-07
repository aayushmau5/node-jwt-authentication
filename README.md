# node-jwt-authentication

## What are JWT ?

JWT stands for JSON Web Token. It is used for authentication mainly.

It is an encoded character which contains three parts.
These 3 parts when decoded, becomes

- Header
- Payload
- Signature

The encoded character is sent back and forth from server to client through cookies.(therefore cookie-parser is used).

## Details

- Header
  - Tells the server what type of signature is being used(contains meta data about the token)
- Payload
  - When payload is decoded(using the signature), it helps us to identify the user(e.g. contains user id)
- Signature
  - It ties everything together and makes the JWT secure. Think of it like a stamp of authenticity

## Working

When our sever makes the JWT after the user successfully logs in or signs up, it creates the header and payload first and encodes them both.

Then to sign the token or to add the signature, it takes both header and payload, and hashes them together with a secure 'secret' string stored on the server(this should be kept very secret as it is the key to unlock JWT).

When the header and payload are hashed together, it creates a signature, then the token signature are then added to the third part of JWT

- header.payload.signature

Thus, the resulting token will look something like this 'jfsk243.fjskjd324.jlkfjsdf020' (dots(.) separate the header,payload and signature).

Then this JWT is then added to the cookie and sent to the client to be stored in the browser.

Now for every request to the server, the cookie is sent to the server and the server can verify the token by looking at the header and the payload and hashing them with the secret(stored in the server).

If the hashed value of those two things matches the signature and also with the hashed value, the server knows that the JWT is valid.

For more information, go to the official [website](https://jwt.io/).
