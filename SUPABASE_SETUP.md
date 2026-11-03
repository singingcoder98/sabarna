# Supabase Setup — Step by Step Guide (Hinglish)

Bhai, tumhe jo error aaya:

```
ERROR: 42601: syntax error at or near "supabase"
LINE 1: supabase/migrations/20261026110000_matibari_admin.sql
```

**Reason:** tumne SQL Editor me file ka *naam* paste kar diya tha. SQL Editor ko file ka naam
nahi, **file ke andar ka SQL code** chahiye. Wo 2 files (`supabase/migrations/...`) codebase me
the hi nahi — isliye maine ek complete file bana di hai: **`supabase/matibari_setup.sql`**

Usme sab kuch hai — tables, security, products, admin login, orders. Bas paste karke Run karna hai.

---

## STEP 1 — SQL Editor kholo
1. Supabase dashboard kholo: https://supabase.com/dashboard
2. Left sidebar me **SQL Editor** pe click karo (terminal icon ⌨️)
3. Naya query tab khulega

## STEP 2 — Purana text hatao
1. Editor me jo 2 lines likhi hain (`supabase/migrations/...`) — **sab select karo**
2. **Delete** dabao (ab editor bilkul khali hona chahiye)

## STEP 3 — SQL file ka content copy karo
1. Project folder me jao → `supabase` folder → **`matibari_setup.sql`** file kholo
2. Notepad / VS Code me kholo
3. **Ctrl + A** (select all) → **Ctrl + C** (copy)

## STEP 4 — Paste karo aur Run karo
1. Supabase SQL Editor me **Ctrl + V** paste karo
2. Right side me green **Run** button (ya **Ctrl + Enter**) dabao
3. Neeche result me aana chahiye: **"Success. No rows returned"**
   ✅ Iska matlab saari tables ban gayi aur data bhi chala gaya

## STEP 5 — Test karo ki sab sahi hai
Editor me ye line likho aur Run karo:

```
select public.verify_admin('saptarsree.b@skykingindia.com', '@Saptarsee1998');
```

Result me **`true`** aana chahiye — iska matlab admin login sahi kaam kar raha hai.

## STEP 6 — Data check karo
Ye 2 queries bhi run karke dekh lo:

```
select id, name, price, active from public.products;
```
→ 7 products dikhenge (3 me `active = true` = Ghee, Honey, Pickle — baaki hidden)

```
select brand_name, tagline from public.site_settings;
```
→ `Matibari` aur tagline dikhega

## STEP 7 — Tables visually dekhlo (optional)
1. Left sidebar me **Table Editor** click karo
2. Tables dikhengi: `products`, `site_settings`, `admin_users`, `otp_challenges`, `orders`
3. Kisi bhi table pe click karke data dekh sakte ho

## STEP 8 — API keys nikalo (website connect karne ke liye)
1. Left sidebar me ⚙️ **Project Settings**
2. **API** (ya "Data API") section kholo
3. Ye 2 cheezein copy karke safe jagah save karo:
   - **Project URL** — `https://xxxxxxxx.supabase.co`
   - **anon public key** — `eyJhbGci...` (lamba text)
   - **service_role key** — sirf server ke liye, **kabhi website me mat daalo**

## STEP 9 — Password badalna / naye admins add karna

Password badalna ho to ek line kaafi hai:

```
select public.set_admin_password('saptarsree.b@skykingindia.com', 'NayaPassword@123');
```

**Naya admin account add karna ho (jaise 3 logon ko login dena ho):**

```
insert into public.admin_users (email, password_hash, full_name)
values ('person1@email.com', public.hash_password('UnkaPassword@123', public.new_salt()), 'Naam 1');

insert into public.admin_users (email, password_hash, full_name)
values ('person2@email.com', public.hash_password('UnkaPassword@123', public.new_salt()), 'Naam 2');

insert into public.admin_users (email, password_hash, full_name)
values ('person3@email.com', public.hash_password('UnkaPassword@123', public.new_salt()), 'Naam 3');
```

> **Website wali side bhi zaroori:** sirf database me add karne se login nahi hoga.
> `src/components/admin/AdminLogin.tsx` me `ADMINS` list me bhi ek line per person add karni hogi.
> Jab batao main 3 email wala system perfectly set kar dunga.

Password set hone ke baad check kar lo:

```
select public.verify_admin('saptarsree.b@skykingindia.com', 'NayaPassword@123');
```
→ `true` aana chahiye.

## STEP 10 — Products / prices badalna ho to
Table Editor → `products` table → row pe click → value edit → **Save**.
Ya SQL se:

```
update public.products set price = 899 where id = 'ghee';
```

Kisi product ko website pe dikhana/band karna:

```
update public.products set active = true  where id = 'turmeric';  -- show
update public.products set active = false where id = 'honey';     -- hide
```

---

## Ab kya bacha hai?

Database ab **ready** hai. Agla step hai website ko is database se jodna (taaki jo tum yahan
badlo, har visitor ko dikhe). Uske liye:
1. `npm install @supabase/supabase-js`
2. Project Settings → API se **URL** aur **anon key** lo
3. Website me ek `.env` file banao us 2 keys ke saath
4. `src/context/SiteContext.tsx` me localStorage ki jagah Supabase se data padhna hai

Ye step karwana ho to bolo — main code bhi kar dunga. Filhaal website browser me save ho rahi
hai (localStorage), aur database ab data ke liye ready hai.

---

## Common errors

| Error | Matlab | Fix |
|---|---|---|
| `syntax error at or near "supabase"` | File ka naam paste kiya | Poora SQL content paste karo (Step 3) |
| `column "id" referenced in foreign key constraint does not exist` | `admin_users` table galat format me pehle se bani thi | Nayi file me **STEP 0 (cleanup)** hai — poora SQL dobara run karo |
| `function crypt(text, text) does not exist` | Purani file me `crypt()` tha | Naya `matibari_setup.sql` (v2) use karo — usme `crypt()` hi nahi hai |
| `function gen_salt(text) does not exist` | pgcrypto nahi mila | Wahi — nayi file use karo, koi extension nahi chahiye |
| `relation "products" already exists` | Pehle se chal chuka hai | Koi dikkat nahi, sab `if not exists` hai |
| `permission denied for table` | RLS ne rok diya | Sahi hai — write sirf service key se hogi |

> **Note:** Agar tumne purani file pehle chala di thi to kuch tables ban gayi hongi.
> Nayi file bilkul safe hai — dobara bhi chala sakte ho, kuch duplicate nahi hoga.
