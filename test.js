/**
@fileOverview

Unit tests for infinite precision integers.

@author
Marc Feeley

@copyright
Copyright (c) 2011-2014 Marc Feeley, All Rights Reserved
*/

/*
 * Run test like this:
 *
 *   d8 num.js test.js 
 */

function test_bignum_pi()
{
    function pi(nb_digits)
    {
        function square_root(x) { return num_root(x, 2); }
        function quartic_root(x) { return num_root(x, 4); }

        var one = num_pow(10, nb_digits);
        var t = num_div(one, 4);
        var b = square_root(num_div(num_square(one), 2));
        var a = one;
        var x = 1;

        while (!num_eq(a, b))
        {
            var new_a = num_div(num_add(a, b), 2);
            t = num_sub(t, num_div(num_mul(x, num_square(num_sub(new_a, a))), one));
            b = square_root(num_mul(a, b));
            a = new_a;
            x = num_mul(x, 2);
        }

        return num_div(num_square(num_add(a, b)), num_mul(4, t));
    }

    print(num_to_string(pi(1000)));
}

function test_bignum_with_radix_log2(radix_log2)
{
    // These tests cover more cases when bignum_radix_log2 is set to 5.

    bignum_radix_log2 = radix_log2;
    bignum_radix = 1 << bignum_radix_log2;
    bignum_radix_div2 = 1 << (bignum_radix_log2-1);

    var n = 600;

    for (var aa=-n; aa<=n; aa++)
    {
        if (bignum_to_js(bignum_from_js(aa)) !== aa)
        {
            throw ("bignum_to_js(bignum_from_js("+aa+")) !== "+aa);
        }

        var a = num_from_js(aa);

        if (num_abs(a) !== Math.abs(aa))
        {
            throw ("num_abs("+a+") !== "+Math.abs(aa));
        }

        if (num_neg(a) !== -aa)
        {
            throw ("num_neg("+a+") !== "+(-aa));
        }

        if (num_not(a) !== ~aa)
        {
            throw ("num_not("+a+") !== "+(~aa));
        }
    }

    for (var aa=-n; aa<=n; aa++)
    {
        for (var bb=-n; bb<=n; bb++)
        {
            var a = num_from_js(aa);
            var b = num_from_js(bb);

            if (num_lt(a, b) !== (aa<bb))
            {
                throw ("num_lt("+a+", "+b+") !== "+(aa<bb));
            }

            if (num_eq(a, b) !== (aa===bb))
            {
                throw ("num_eq("+a+", "+b+") !== "+(aa===bb));
            }

            if (num_gt(a, b) !== (aa>bb))
            {
                throw ("num_gt("+a+", "+b+") !== "+(aa>bb));
            }

            if (num_add(a, b) !== (aa+bb))
            {
                throw ("num_add("+a+", "+b+") !== "+(aa+bb));
            }

            if (num_sub(a, b) !== (aa-bb))
            {
                throw ("num_sub("+a+", "+b+") !== "+(aa-bb));
            }

            if (num_mul(a, b) !== (aa*bb))
            {
                throw ("num_mul("+a+", "+b+") !== "+(aa*bb));
            }

            if (num_and(a, b) !== (aa&bb))
            {
                throw ("num_and("+a+", "+b+") !== "+(aa&bb));
            }

            if (num_or(a, b) !== (aa|bb))
            {
                throw ("num_or("+a+", "+b+") !== "+(aa|bb));
            }

            if (num_xor(a, b) !== (aa^bb))
            {
                throw ("num_xor("+a+", "+b+") !== "+(aa^bb));
            }
        }
    }

    for (var aa=0; aa<=n; aa++)
    {
        for (var bb=1; bb<=10; bb++)
        {
            var a = num_from_js(aa);
            var b = num_from_js(bb);

            if (num_div(a, b) !== Math.floor(aa/bb))
            {
                throw ("num_div("+a+", "+b+") !== "+Math.floor(aa/bb));
            }

            if (num_mod(a, b) !== (aa%bb))
            {
                throw ("num_mod("+a+", "+b+") !== "+(aa%bb));
            }
        }
    }

    var n = 0;

    for (var w = 0; w<15; w++)
    {
        for (var i = 0; i<(w===0?1:(1<<(w-1))); i++)
        {
            if (num_width(num_from_js(n)) !== w)
            {
                throw ("num_width(num_from_js("+n+")) !== "+w);
            }

            if (num_width(num_from_js(~n)) !== w)
            {
                throw ("num_width(num_from_js("+(~n)+")) !== "+w);
            }

            n++;
        }
    }

    for (var a=-711; a<=711; a++)
    {
        for (var shift=-19; shift<=19; shift++)
        {
            var res;

            if (shift < 0)
                res = a >> -shift;
            else
                res = a << shift;

            if (num_shift(a, shift) !== res)
            {
                throw ("num_shift("+a+", "+shift+") !== "+res);
            }
        }
    }

    if (num_to_string(num_shift(1,1000)) !==
        "10715086071862673209484250490600018105614048117055336074437503883703510511249361224931983788156958581275946729175531468251871452856923140435984577574698574803934567774824230985421074605062371141877954182153046474983581941267398767559165543946077062914571196477686542167660429831652624386837205668069376")
    {
        throw ("num_to_string(num_shift(1,1000)) is incorrect");
    }

//    test_bignum_pi();
}

function test_bignum()
{
    for (var radix_log2=bignum_radix_log2; radix_log2>=5; radix_log2--)
      test_bignum_with_radix_log2(radix_log2);
}

test_bignum();
