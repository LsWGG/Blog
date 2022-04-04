---
title: Python加解密操作
date: 2020-11-10 18:01:53
tags: Python
top: 0
---

# Python加解密操作汇总

## 一、RSA加解密

RSA加密算法是一种非对称加密算法，加密的秘钥是由公钥和私钥两部分组成秘钥对，公钥用来加密消息，私钥用来对消息进行解密；也可进行反向操作

<!--more-->

### 1. 生成密钥对

```python
from Crypto import Random
from Crypto.PublicKey import RSA

# 伪随机数生成器
random_gen = Random.new().read

# 生成秘钥对实例对象：1024是秘钥的长度
rsa = RSA.generate(1024, random_gen)

# 获取公钥，保存到文件
private_pem = rsa.exportKey()
with open('private.pem', 'wb') as f:
    f.write(private_pem)

# 获取私钥保存到文件
public_pem = rsa.publickey().exportKey()
with open('public.pem', 'wb') as f:
    f.write(public_pem)
```

### 2. 加解密

1.  **公钥加密**

   ```python
   import base64
   from Crypto.PublicKey import RSA
   from Crypto.Cipher import PKCS1_v1_5
   
   
   msg = "待加密明文内容"
   
   # 读取文件中的公钥
   key = open('public.pem').read()
   publickey = RSA.importKey(key)
   # 进行加密
   pk = PKCS1_v1_5.new(publickey)
   encrypt_text = pk.encrypt(msg.encode())
   # 加密通过base64进行编码
   result = base64.b64encode(encrypt_text)
   print(result)
   ```

2.  **私钥解密**

   ```python
   import base64
   from Crypto.PublicKey import RSA
   from Crypto.Cipher import PKCS1_v1_5
   # 密文
   msg='bAlnUNEJeDLnWikQs1ejwqPTo4qZ7RWxgFwoO4Bfg3C7EY+1HN5UvJYJ2h6047K6vNjG+TiIxc0udTR7a12MivSA+DwoGjwFIb25u3zc+M8KTCaCT5GdSumDOto2tsKYaVDKCPZpdwYdzYwlVijr6cPcchQTlD1yfKk2khhNchU='

   # base64解码
   msg = base64.b64decode(msg)
   # 获取私钥
   privatekey = open('private.pem').read()
   rsakey = RSA.importKey(privatekey)
   # 进行解密
   cipher = PKCS1_v1_5.new(rsakey)
   text = cipher.decrypt(msg, 'DecryptError')
   # 解密出来的是字节码格式，decodee转换为字符串
   print(text.decode())
   ```

---

> 用到M2Crypto库，安装详见：[点此跳转](https://lswgg.github.io/2020/12/21/%E5%AE%89%E8%A3%85M2Crypto%E6%A8%A1%E5%9D%97%E8%AE%B0%E5%BD%95/)

1. 私钥加密

   ```python
   # -*- coding:utf-8 -*-
   import os
   import M2Crypto
   import base64
   
   def rsa_encrypt2(data):
       """
       RSA 私钥加密（分段）：1024bit的证书用100， 2048bit的证书用 200
       """
       public_key_path = os.path.join(PEM_PATH, 'private_key.pem')
       rsa_pri = M2Crypto.RSA.load_key(public_key_path)
   
       num = None
       output = ''
       bit = conf.get('RSA', 'bit')
       if bit == '1024':
           num = 100
       elif bit == '2048':
           num = 200
   
       while data:
           im_put = data[:num]
           data = data[num:]
           out = rsa_pri.private_encrypt(im_put, M2Crypto.RSA.pkcs1_padding)
           output += out
       pri_64 = base64.b64encode(output)
       return pri_64
   ```

   

2. 公钥解密

   ```python
   # -*- coding:utf-8 -*-
   import os
   import M2Crypto
   import base64
   
   def rsa_decrypt2(data):
       """
       RSA 公钥解密（分段）：1024bit的证书用128，2048bit证书用256位
       """
       # base64解码
       data = base64.b64decode(data)
       public_key_path = os.path.join(PEM_PATH, 'public_key.pem')
       rsa_pub = M2Crypto.RSA.load_pub_key(public_key_path)
   
       num = None
       output = ''
       bit = conf.get('RSA', 'bit')
       if bit == '1024':
           num = 128
       elif bit == '2048':
           num = 256
   
       while data:
           in_put = data[:num]
           data = data[num:]
           out = rsa_pub.public_decrypt(in_put, M2Crypto.RSA.pkcs1_padding)
           output = output + out
   
       return output
   ```

   

### 3. 分段加密和解密

==如果数据长度超过了当前秘钥的所能处理最大长度，则需要进行分段加密==

```python
import base64
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_v1_5



def cipher(msg):
    """
    公钥加密：1024bit的证书用100， 2048bit的证书用 200
    :param msg: 要加密内容
    :return:  加密之后的密文
    """
    # 获取公钥
    key = open('public.pem').read()
    publickey = RSA.importKey(key)
    # 分段加密
    pk = PKCS1_v1_5.new(publickey)
    encrypt_text = []
    for i in range(0,len(msg),100):
        cont = msg[i:i+100]
        encrypt_text.append(pk.encrypt(cont.encode()))
    # 加密完进行拼接
    cipher_text = b''.join(encrypt_text)
    # base64进行编码
    result = base64.b64encode(cipher_text)
    return result.decode()


def decrypt(msg):
    """
    私钥进行解密：1024bit的证书用128，2048bit证书用256位
    :param msg: 密文：字符串类型
    :return:  解密之后的内容
    """
    # base64解码
    msg = base64.b64decode(msg)
    # 获取私钥
    privatekey = open('private.pem').read()
    rsakey = RSA.importKey(privatekey)
    cipher =  PKCS1_v1_5.new(rsakey)
    # 进行解密
    text = []
    for i in range(0,len(msg),128):
        cont = msg[i:i+128]
        text.append(cipher.decrypt(cont,1))
    text = b''.join(text)
    return text.decode()
```

### 4. 签名和验签

1. **私钥签名**

   ```python
   from Crypto.Hash import SHA
   from Crypto.Signature import PKCS1_v1_5 as Sig_pk
   from Crypto.PublicKey import RSA
   import base64
   
   # 待签名内容
   name = "musen"
   # 获取私钥
   key = open('private.pem', 'r').read()
   rsakey = RSA.importKey(key)
   # 根据sha算法处理签名内容  (此处的hash算法不一定是sha,看开发)
   data = SHA.new(name.encode())
   # 私钥进行签名
   sig_pk = Sig_pk.new(rsakey)
   sign = sig_pk.sign(data)
   # 将签名后的内容，转换为base64编码
   result = base64.b64encode(sign)
   # 签名结果转换成字符串
   data = result.decode()
   print(data)
   ```

2. **公钥验签**

   ```python
   from Crypto.Hash import SHA
   from Crypto.Signature import PKCS1_v1_5 as Sig_pk
   from Crypto.PublicKey import RSA
   import base64
   
   
   # 签名之前的内容
   name = "musen"
   
   # 签名数据
   data="X3Gg+wd7UDh4X8ra+PGCyZFUrG+6jDeQt6ajMA0EjwoDwxlddLzYoS4dtjQ2q5WCcRhxcp8fjEyoPXBmJE9rMKDjEIeE/VO0sskbJiO65fU8hgcqdWdgbVqRryhOw+Kih+I6RIeNRYnOB8GkGD8Qca+n9JlOELcxLRdLo3vx6dw="
   # base64解码
   data = base64.b64decode(data)
   # 获取公钥
   key = open('public.pem').read()
   rsakey = RSA.importKey(key)
   # 将签名之前的内容进行hash处理
   sha_name = SHA.new(name.encode())
   # 验证签名
   signer = Sig_pk.new(rsakey)
   result = signer.verify(sha_name, data)
   # 验证通过返回True   不通过返回False
   print(result)
   ```



