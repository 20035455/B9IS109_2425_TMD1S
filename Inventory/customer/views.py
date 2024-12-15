# Python modules 
import re
from datetime import datetime, date, timezone

# Django modules
from django.db.models import Sum
from django.db import transaction
from django.http import JsonResponse
from django.core.paginator import Paginator
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

# Project modules
from customer.models import *
from customer.serializers import *

# Function for checking password is a strong one
def is_strong_password(password):
    if len(password) < 8:
        return False

    if not re.search("[a-zA-Z]", password):
        return False

    if not re.search("[0-9]", password):
        return False

    if not re.search('[!@#$%^&*()-_+={}[]|\:;",<.>/?]', password):
        return False

    return True

# Function for email validation
def email_validation(email):
    return bool(re.match(r"[^@]+@[^@]+\.[^@]+", email))


@login_required(login_url="logout_view")
def quotation(request):
    return render(request, "quotation.html")


def index(request):
    try:
        if request.user.is_authenticated:
            return redirect("sub_company")
        return render(request, "index.html")
    except:
        return redirect("logout_view")


@login_required(login_url="logout_view")
def dashboard(request):
    # try:
        notofication_data = []
        notification_count = 0
        price_data = []
        user_id = request.user
        company_data = Company.objects.get(authuser=user_id)
        id = request.GET.get("id")
        subcompany_id = SubCompany.objects.get(id=id)
        product_data = ProductMaster.objects.filter(
            delete_status=True, company_id=company_data, subcompany_id=subcompany_id.id
        )
        # try:
        for i in product_data:
            product_price = 0
            if float(i.number) <= 10:
                notofication_data.append(i)
                notification_count = len(notofication_data)
            product_price = float(i.purchase_amount) * float(i.quantity_for_amount)
            price_data.append(product_price)
        # except:
        #     product_price = 0
        total_sum = sum(float(price) for price in price_data)
        customer_data = Costumer.objects.filter(
            company_id=company_data, subcompany_id=subcompany_id.id
        )
        customer_data_id = list(customer_data.values_list("id", flat=True))
        customer_total = list(customer_data.values_list("grand_total_amount", flat=True))
        customer_total_amount = sum(float(price) for price in customer_total)
        profit_dict = customer_data.aggregate(total_profit=Sum('profit'))
        profit_amount_total = profit_dict['total_profit']
        return render(
            request,
            "dashboard.html",
            {
                "product_data": product_data,
                "customer_data": customer_data,
                "subcompany_id": subcompany_id,
                "total_sum": total_sum,
                "notofication_data": notofication_data,
                "notification_count": notification_count,
                "customer_total_amount": customer_total_amount,
                "profit_amount_total": profit_amount_total,
            },
        )
    # except Exception as e:
    #      return JsonResponse(
    #     {
    #         "message": e,
    #     }
    # )
        


def register(request):
    return render(request, "register.html")

@login_required(login_url="logout_view")
def lead(request):
    try:
        user_id = request.user
        company_data = Company.objects.get(authuser=user_id)
        id = request.GET.get("id")
        subcompany_id = SubCompany.objects.get(id=id)
        category_data = ProductCategory.objects.filter(
            company_id=company_data, subcompany_id=subcompany_id.id
        )
        return render(
            request,
            "lead.html",
            {"category_data": category_data, "subcompany_id": subcompany_id},
        )
    except:
        return HttpResponse("<h5>something went wrong</h5>")


@login_required(login_url="logout_view")
def sub_company(request):
    user_id = request.user
    company_data = Company.objects.get(authuser=user_id)
    subcompany_data = SubCompany.objects.filter(
        company_id=company_data, is_active=True
    )
    subcompany_data_count = subcompany_data.count()
    return render(
        request,
        "sub_company.html",
        {
            "subcompany_data": subcompany_data,
            "subcompany_data_count": subcompany_data_count,
        },
    )


@login_required(login_url="logout_view")
def inactive_company(request):
    user_id = request.user
    company_data = Company.objects.get(authuser=user_id)
    subcompany_data = SubCompany.objects.filter(
        company_id=company_data, is_active=False
    )
    subcompany_data_count = subcompany_data.count()
    return render(
        request,
        "inactive_company.html",
        {
            "subcompany_data": subcompany_data,
            "subcompany_data_count": subcompany_data_count,
        },
    )


@login_required(login_url="logout_view")
def accounts(request):
    try:
        user_id = request.user
        company_data = Company.objects.get(authuser=user_id)
        id = request.GET.get("id")
        subcompany_id = SubCompany.objects.get(id=id)
        category_data = ProductCategory.objects.filter(
            company_id=company_data, subcompany_id=subcompany_id.id
        )
        product_data = ProductMaster.objects.filter(
            delete_status=True, company_id=company_data, subcompany_id=subcompany_id.id
        )
        return render(
            request,
            "product.html",
            {
                "category_data": category_data,
                "product_data": product_data,
                "subcompany_id": subcompany_id,
            },
        )
    except Exception as e:
        return HttpResponse(str(e))

@login_required(login_url="logout_view")
def product_data(request):
    user_id = request.user
    company_data = Company.objects.get(authuser=user_id)
    page_number = request.POST.get("page")
    subcompany_id = request.GET.get("subcompany_id")
    product_data = ProductMaster.objects.filter(
        subcompany_id=subcompany_id, company_id=company_data
    )
    total_count = product_data.count()
    paginator = Paginator(product_data, 10)
    page_obj = paginator.get_page(page_number)
    current_page = page_obj.number
    next_page = page_obj.next_page_number() if page_obj.has_next() else None
    previous_page = page_obj.previous_page_number() if page_obj.has_previous() else None
    total_pages = paginator.num_pages
    serialized_product_data = ProductSerializer(page_obj, many=True).data
    return JsonResponse(
        {
            "product_data": serialized_product_data,
            "current_page": current_page,
            "next_page": next_page,
            "previous_page": previous_page,
            "total_pages": total_pages,
            "status": True,
            "total_count": total_count,
        }
    )


@login_required(login_url="logout_view")
def customer(request):
    # try:
    user_id = request.user
    company_data = Company.objects.get(authuser=user_id)
    id = request.GET.get("id")
    subcompany_id = SubCompany.objects.get(id=id)
    product_data = ProductMaster.objects.filter(
        company_id=company_data, subcompany_id=subcompany_id.id
    )
    customer_data = Costumer.objects.filter(
        company_id=company_data, subcompany_id=subcompany_id.id
    )
    return render(
        request,
        "customer.html",
        {
            "product_data": product_data,
            "customer_data": customer_data,
            "subcompany_id": subcompany_id,
        },
    )


# except:
#     return HttpResponse("<h5>something went wrong</h5>")


@login_required(login_url="logout_view")
def edit_category_modal(request):
    id = request.GET.get("id")
    data = ProductCategory.objects.get(id=id)
    return render(request, "edit_category_modal.html", {"data": data})


@login_required(login_url="logout_view")
def edit_product_modal(request):
    category_data = ProductCategory.objects.all()
    id = request.GET.get("id")
    data = ProductMaster.objects.get(id=id)
    return render(
        request,
        "edit_product_modal.html",
        {
            "category_data": category_data,
            "data": data,
        },
    )


@login_required(login_url="logout_view")
def edit_company_modal(request):
    id = request.GET.get("id")
    data = SubCompany.objects.get(id=id)
    return render(request, "edit_company_modal.html", {"data": data})


@login_required(login_url="logout_view")
def view_customer_details(request):
    id = request.GET.get("id")
    customer = Costumer.objects.get(id=id)
    product_detail = CustomerProductDetails.objects.filter(customer_id=customer.id)
    return render(
        request,
        "view_customer_details.html",
        {
            "customer": customer,
            "product_detail": product_detail,
        },
    )


def logout_view(request):
    logout(request)
    request.session.flush()
    return redirect("/")


def signup_action(request):
    if request.method == "POST":
        data = {key: value.strip() for key, value in request.POST.items()}
        username = data["username"]
        email = data["email"]
        password = data["password"]
        permission = request.POST.get("is_checked", False)

        validation_error = {}

        if permission == False:
            validation_error["permission"] = "Please accept terms and condition"
        if len(password) < 6:
            validation_error["Password"] = "Password should atleast 6 characters"
        if Company.objects.only("email").filter(email__iexact=email).exists():
            validation_error["Email"] = "Email already Exist"
        if email and not email_validation(email):
            validation_error["Email"] = "Invalid Email"
        if not username:
            validation_error["Username"] = "Enter username"
        if not email:
            validation_error["Email"] = "Enter email"
        if not password:
            validation_error["Password"] = "Enter password"
        if User.objects.only("username").filter(username__iexact=username).exists():
            validation_error["Username"] = "Username Exist"
        if password and not is_strong_password(password):
            validation_error["Password"] = "Password must be mix of letters and numbers"

        if len(validation_error) > 0:
            return JsonResponse(
                {"status": "validation_error", "validation_error": validation_error}
            )

        my_user = User.objects.create_user(
            username=username.lower(), password=password, email=email.lower()
        )
        user = authenticate(username=username.lower(), password=password)
        auth_user = Company.objects.create(
            authuser=my_user,
            email=email.lower(),
            permission=True,
            created_by=my_user,
            updated_by=my_user,
            updated_dt=date.today(),
            updated_tm=datetime.now(),
        )
        login(request, user)
        company_id = auth_user.id
        company_id_id = Company.objects.get(id=company_id)
        return JsonResponse({"status": "success", "redirect_url": "sub_company"})


def login_action(request):
    if request.method == "POST":
        data = {key: value.strip() for key, value in request.POST.items()}
        username = data["username"]
        password = data["password"]
        invalid_error = {}
        if not username:
            invalid_error["Username"] = "Enter Username"
        if not password:
            invalid_error["Password"] = "Enter Password"
        if username != "" and not User.objects.filter(username=username).exists():
            invalid_error["Username"] = "Invalid Username"
        if len(invalid_error) > 0:
            return JsonResponse(
                {"status": "invalid_error", "invalid_error": invalid_error}
            )
        if (
            not User.objects.filter(username=username.lower())
            .first()
            .check_password(data["password"])
        ):
            return JsonResponse(
                {
                    "status": "invalid_error",
                    "invalid_error": {"Password": "Incorrect Password"},
                }
            )
        my_user = authenticate(request, username=username.lower(), password=password)
        if my_user is not None and my_user.is_authenticated:
            login(request, my_user)
            return JsonResponse(
                {"status": "success", "redirect_url": "sub_company"}
            )
        elif my_user is not None:
            login(request, my_user)
            return JsonResponse(
                {"status": "success", "redirect_url": "sub_company"}
            )
        else:
            return JsonResponse(
                {
                    "status": "invalid_error",
                    "invalid_error": {"password": "Invalid Password"},
                }
            )

    else:
        return JsonResponse({"message": "error"})

@login_required(login_url="logout_view")
def add_category_action(request):
    data = {key: value.strip() for key, value in request.POST.items()}
    if request.method == "POST":
        user_id = request.user
        company_data = Company.objects.get(authuser=user_id)
        category_name = data["category_name"]
        subcompany_id = SubCompany.objects.get(id=data["subcompany_id"])
        error_dict = {}
        if category_name == "" or category_name == None:
            error_dict["category"] = "Enter Category"
        if ProductCategory.objects.filter(
            category_name__iexact=category_name,
            company_id=company_data,
            subcompany_id=subcompany_id.id,
        ).exists():
            error_dict["category"] = "Category name already exist"
        if len(error_dict) > 0:
            return JsonResponse({"status": "error_dict", "error_dict": error_dict})
        created_data = ProductCategory.objects.create(
            category_name=category_name,
            company_id=company_data,
            subcompany_id=subcompany_id,
            created_by=request.user,
            updated_by=request.user,
            updated_dt=date.today(),
            updated_tm=datetime.now(),
        )
        created_serializer = CategorySerializer(created_data).data
        created_data_count = ProductCategory.objects.filter(
            company_id=company_data, subcompany_id=subcompany_id.id
        ).count()
    return JsonResponse(
        {
            "status": "success",
            "created_serializer": created_serializer,
            "created_data_count": created_data_count,
        }
    )

@login_required(login_url="logout_view")
def edit_category_action(request, id):
    data = {key: value.strip() for key, value in request.POST.items()}
    if request.method == "POST":
        user_id = request.user
        company_data = Company.objects.get(authuser=user_id)
        category_name1 = data["category_name1"]
        existing_id = ProductCategory.objects.get(id=data["id"])
        subcompany_id = existing_id.subcompany_id
        error_dict = {}
        if category_name1 == "" or category_name1 == None:
            error_dict["category1"] = "Enter Category"
        if (existing_id.category_name.lower()) == category_name1.lower():
            pass
        elif ProductCategory.objects.filter(
            category_name__iexact=category_name1,
            company_id=company_data,
            subcompany_id=subcompany_id.id,
        ).exists():
            error_dict["category1"] = "Category Exist"
        if len(error_dict) > 0:
            return JsonResponse({"status": "error_dict", "error_dict": error_dict})
        update_data = ProductCategory.objects.filter(id=id)
        before_update = CategorySerializer(update_data, many=True).data
        update_data.update(category_name=category_name1)
        after_update = CategorySerializer(update_data, many=True).data
        if after_update == before_update:
            return JsonResponse({"status": "no_update"})
        else:
            return JsonResponse({"status": "success", "after_update": after_update})

@login_required(login_url="logout_view")
def delete_category(request, id):
    category_id = request.GET.get("category_id")
    delete_data = ProductCategory.objects.get(id=id)
    product_data = ProductMaster.objects.filter(category_id=delete_data)
    if product_data:
        return JsonResponse({"status": "error"})
    else:
        delete_data.delete()
        return JsonResponse({"status": "success"})

@login_required(login_url="logout_view")
def delete_customer(request, id):
    delete_data = Costumer.objects.get(id=id).delete()
    return JsonResponse({"status": "success"})

@login_required(login_url="logout_view")
def add_product_action(request):
    data = {key: value.strip() for key, value in request.POST.items()}
    if request.method == "POST":
        product_name = data["product_name"]
        hsn_code = data["hsn_code"]
        product_company = data["product_company"]
        try:
            category = ProductCategory.objects.get(id=data["category"])
        except:
            category = None
        description = data["description"]
        purchase_amount = data["amount"]
        quantity = data["quantity"]
        location = data["location"]
        supplier_name = data["supplier_name"]
        sale_price_without_gst = (
            data["sale_price_without_gst"] if data["sale_price_without_gst"] else 0
        )
        total_amount = data["total_amount"] if data["total_amount"] else 0
        product_code = data["product_code"]
        gst_percentage = data["gst_percentage"] if data["gst_percentage"] else 0
        gst_amount = data["gst_amount"] if data["gst_amount"] else 0
        cgst_percentage = data["cgst_percentage"] if data["cgst_percentage"] else 0
        cgst_amount = data["cgst_amount"] if data["cgst_amount"] else 0
        sgst_percentage = data["sgst_percentage"] if data["sgst_percentage"] else 0
        sgst_amount = data["sgst_amount"] if data["sgst_amount"] else 0
        product_active = request.POST.get("product_active", False)
        subcompany_id = SubCompany.objects.get(id=data["subcompany_id"])
        user_id = request.user
        company_data = Company.objects.get(authuser=user_id)
        error_dict = {}
        if product_name == "" or product_name == None:
            error_dict["product_name"] = "Enter product name"
        if purchase_amount == "":
            error_dict["amount"] = "Enter Purchase amount"
        if product_company == "" or product_company == None:
            error_dict["product_company"] = "Enter Company Name"
        if category == "" or category == None:
            error_dict["category"] = "Select category"
        if not quantity:
            error_dict["quantity"] = "Enter product quantity"
        if ProductMaster.objects.filter(
            product_name__iexact=product_name,
            company_id=company_data,
            subcompany_id=subcompany_id.id,
            product_company_name__iexact=product_company,
        ).exists():
            error_dict["product_name"] = "Product name already exist"
        if quantity and float(quantity) <= 0:
            error_dict["quantity"] = "Product quantity should be greater than 0"
        if purchase_amount and float(purchase_amount) <= 0:
            error_dict["amount"] = "Purchase amount should be greater than 0"
        if not sale_price_without_gst or float(sale_price_without_gst) <= 0:
            error_dict["sale_price_without_gst"] = (
                "Sale price is required and should be greater than 0"
            )
        if len(error_dict) > 0:
            return JsonResponse({"status": "error_dict", "error_dict": error_dict})
        created_data = ProductMaster.objects.create(
            quantity_for_amount=quantity,
            active_status=product_active,
            product_company_name=product_company,
            product_name=product_name,
            product_hsn=hsn_code,
            category_id=category,
            product_description=description,
            purchase_amount=purchase_amount,
            number=quantity,
            inventory_location=location,
            supplier_name=supplier_name,
            company_id=company_data,
            subcompany_id=subcompany_id,
            created_by=request.user,
            updated_by=request.user,
            updated_dt=date.today(),
            updated_tm=datetime.now(),
            product_code=product_code,
            sale_price_without_gst=sale_price_without_gst,
            total_amount=total_amount,
            gst_percentage=gst_percentage,
            gst_amount=gst_amount,
            cgst_percentage = cgst_percentage,
            cgst_amount = cgst_amount,
            sgst_percentage = sgst_percentage,
            sgst_amount = sgst_amount,
        )

        created_serializer = ProductSerializer(created_data).data
        created_data_count = ProductMaster.objects.filter(
            company_id=company_data, subcompany_id=subcompany_id.id
        ).count()
    return JsonResponse(
        {
            "status": "success",
            "created_serializer": created_serializer,
            "created_data_count": created_data_count,
        }
    )

@login_required(login_url="logout_view")
def edit_product_action(request, id):
    data = {key: value.strip() for key, value in request.POST.items()}
    if request.method == "POST":
        product_name = data["product_name1"]
        hsn_code = data["hsn_code1"]
        product_company = data["product_company1"]
        try:
            category = ProductCategory.objects.get(id=data["category1"])
        except:
            category = None
        description = data["description1"]
        amount = data["amount1"]
        quantity = data["quantity1"]
        location = data["location1"]
        supplier_name = data["supplier_name1"]
        product_active = request.POST.get("product_active1", False)
        sale_price_without_gst = (
            data["sale_price_without_gst"] if data["sale_price_without_gst"] else 0
        )
        total_amount = data["total_amount"] if data["total_amount"] else 0
        product_code = data["product_code"]
        gst_percentage = data["gst_percentage"] if data["gst_percentage"] else 0
        gst_amount = data["gst_amount"] if data["gst_amount"] else 0
        cgst_percentage = data["cgst_percentage"] if data["cgst_percentage"] else 0
        cgst_amount = data["cgst_amount"] if data["cgst_amount"] else 0
        sgst_percentage = data["sgst_percentage"] if data["sgst_percentage"] else 0
        sgst_amount = data["sgst_amount"] if data["sgst_amount"] else 0
        error_dict = {}
        if product_name == "" or product_name == None:
            error_dict["product_name1"] = "Enter product name"
        if amount == "":
            error_dict["amount1"] = "Enter Purchase amount"
        if not data["sale_price_without_gst"]:
            error_dict["update_sale_price_without_gst"] = "Enter sale amount"
        if product_company == "" or product_company == None:
            error_dict["product_company1"] = "Enter Company Name"
        if category == "" or category == None:
            error_dict["category1"] = "Select category"
        if not quantity:
            error_dict["quantity1"] = "Enter product quantity"
        # if (existing_id.product_name.lower()) == product_name.lower() :
        #     pass
        # elif ProductMaster.objects.filter(product_name__iexact=product_name,company_id = company_data,subcompany_id = subcompany_id.id,product_company_name__iexact = product_company).exists():
        #     error_dict['product_name1'] = "Product exist"
        if quantity and float(quantity) <= 0:
            error_dict["quantity1"] = "Product quantity should be greater than 0"
        if amount and float(amount) <= 0:
            error_dict["amount1"] = "Purchase amount should be greater than 0"
        if len(error_dict) > 0:
            return JsonResponse({"status": "error_dict", "error_dict": error_dict})
        update_data = ProductMaster.objects.filter(id=id)
        before_update = ProductSerializer(update_data, many=True).data
        update_data.update(
            quantity_for_amount=quantity,
            active_status=product_active,
            product_company_name=product_company,
            product_name=product_name,
            product_hsn=hsn_code,
            category_id=category,
            product_description=description,
            purchase_amount=amount,
            number=quantity,
            inventory_location=location,
            supplier_name=supplier_name,
            product_code=product_code,
            sale_price_without_gst=sale_price_without_gst,
            total_amount=total_amount,
            gst_percentage=gst_percentage,
            gst_amount=gst_amount,
            cgst_percentage = cgst_percentage,
            cgst_amount = cgst_amount,
            sgst_percentage = sgst_percentage,
            sgst_amount = sgst_amount,
        )
        after_update = ProductSerializer(update_data, many=True).data
        if before_update == after_update:
            return JsonResponse({"status": "no_update"})
        else:
            return JsonResponse({"status": "success", "after_update": after_update})

@login_required(login_url="logout_view")
def delete_product(request, id):
    product_id = request.GET.get("category_id")
    delete_data = ProductMaster.objects.filter(id=id).update(delete_status=False)
    return JsonResponse({"status": "success"})

from datetime import datetime
@login_required(login_url="logout_view")
@transaction.atomic()
def add_customer_action(request):
    data = {key: value.strip() for key, value in request.POST.items()}
    if request.method == "POST":
        fname = data["fname"]
        lname = data["lname"]
        email = data["email"]
        phone = data["phone"]
        date = data["date"] if data["date"] else datetime.now().date()
        subcompany_id = SubCompany.objects.get(id=data["subcompany_id"])
        user_id = request.user
        company_data = Company.objects.get(authuser=user_id)
        error_dict = {}
        if fname == "":
            error_dict["First_name"] = "Enter First Name"
        if phone == "":
            error_dict["Phone"] = "Enter Phone Number"
        if email and not email_validation(email):
            error_dict["Email"] = "Invalid Email Address"
        if phone and len(phone) < 10:
            error_dict["Phone"] = "Invalid Phone Number"
        if len(error_dict) > 0:
            return JsonResponse({"status": "error_dict", "error_dict": error_dict})

        product_id = request.POST.getlist("product_id")
        if not product_id:
            return JsonResponse({"status": "product_validation"})

        created_data = Costumer.objects.create(
            customer_firstname=fname,
            customer_lastname=lname,
            customer_email=email,
            customer_phone_no=phone,
            company_id=company_data,
            subcompany_id=subcompany_id,
            created_by=request.user,
            updated_by=request.user,
            date=date,
        )
        created_data_id = created_data.id
        customer_id = Costumer.objects.get(id=created_data_id)
        row_id = request.POST.getlist("row_id")
        zip_obj = zip(product_id, row_id)
        total_product, sub_total_amount, total_discount, total_gst_amount,total_product_quantity = (0,0,0,0,0)
        for product_id, i in zip_obj:
            if product_id:
                print(product_id)
                try:
                    product_id = ProductMaster.objects.get(id=product_id)
                except:
                    product_id = None
                each_product_quantity = float(data["quantity" + i])
                each_product_sale_price = float(data["sales_price" + i])
                each_product_discount = float(data["discount" + i]) if data["discount" + i] else 0
                each_product_total = float(data["total" + i]) if data["total" + i] else 0
                each_product_gst = float(data["gst" + i]) if data["gst" + i] else 0
                each_product_purchase_price = (
                float(data["purchase_price" + i]) if data["purchase_price" + i] else 0
                )
                if product_id != None:
                    product_val = []
                    if each_product_quantity == "":
                        product_val.append("Enter Product quantity")
                    if each_product_sale_price == "":
                        product_val.append("Enter Sales Price")
                    if each_product_sale_price and each_product_sale_price <= 0:
                        product_val.append("Product quantity should be greater than 0")
                    if each_product_quantity and each_product_quantity <= 0:
                        product_val.append("Product quantity should be greater than 0")
                    if each_product_quantity and float(product_id.number) < float(
                        each_product_quantity
                    ):
                        product_val.append(f"Only {product_id.number} stock left for {product_id.product_name}")
                        created_data.delete()
                    if len(product_val) > 0:
                        return JsonResponse(
                            {"status": "product_val", "product_val": product_val}
                        )

                    each_product_total = (float(product_id.total_amount) * float(each_product_quantity)) - float(each_product_discount)
                    total_product += 1
                    total_product_quantity += each_product_quantity
                    sub_total_amount += each_product_total + float(each_product_discount)
                    total_discount += each_product_discount
                    total_gst_amount += each_product_gst
                    profit = ((each_product_sale_price * each_product_quantity)- (each_product_purchase_price * each_product_quantity)) - each_product_discount
                    customer_product = CustomerProductDetails.objects.create(
                        customer_id=customer_id,
                        customer_product=product_id,
                        product_name = product_id.product_name,
                        product_sale_price = product_id.total_amount,
                        product_quantity=each_product_quantity,
                        discount_amount = each_product_discount,
                        gst_percentage = product_id.gst_percentage,
                        gst_amount = each_product_gst,
                        total_amount = each_product_total,
                        created_by=request.user,
                        updated_by=request.user,
                    )

                    product_id.number = float(product_id.number) - float(each_product_quantity)
                    product_id.save()

        total_amount=sub_total_amount - total_discount
        current_year = datetime.now().year
        order_id = f"{current_year}_{created_data_id}"
        created_data.order_id=order_id
        created_data.profit=profit
        created_data.total_product=total_product
        created_data.total_product_quantity=total_product_quantity
        created_data.total_tax_amount=total_gst_amount
        created_data.total_discount_amount=total_discount
        created_data.sub_total_amount=sub_total_amount
        created_data.grand_total_amount=total_amount
        created_data.cgst_amount=total_gst_amount/2
        created_data.sgst_amount=total_gst_amount/2

        created_data.save()
        created_serializer = CustomerSerializer(created_data).data
        customer_count = Costumer.objects.filter(
            subcompany_id=subcompany_id.id
        ).count()

    return JsonResponse(
        {
            "status": "success",
            "created_serializer": created_serializer,
            "order_id": order_id,
            "customer_count": customer_count,
            "total_price_amount1": total_amount,
            "created_data_id": created_data_id,
        }
    )

@login_required(login_url="logout_view")
def product_purchase_amount_view(request):
    if request.method == "GET":
        try:
            id = request.GET.get("id")
            product = ProductMaster.objects.get(id=id)
            serializer = ProductSerializer(product).data
            return JsonResponse(
                {"status": True, "message": "Success", "product": serializer}
            )
        except:
            return JsonResponse({"message": "none"})


def create_sub_company(request):
    data = {key: value.strip() for key, value in request.POST.items()}
    if request.method == "POST":
        user_id = request.user
        company_data = Company.objects.get(authuser=user_id)
        company_name = data["company_name"]
        phone = data["phone"]
        email = data["email"]
        location = data["location"]
        gst_number = data["gst_number"]
        company_image = request.FILES.get("company_image")
        error_dict = {}
        if company_name == "" or company_name == None:
            error_dict["company_name"] = "Enter Company Name"
        if company_name != "" and len(company_name) >= 100:
            error_dict["company_name"] = "Company Name Too Large"
        if phone == "":
            error_dict["phone"] = "Enter Phobe Number"
        if location == "":
            error_dict["location"] = "Enter Location"
        if phone != "" and len(phone) <= 9:
            error_dict["phone"] = "Invalid Phone Number"
        if email == "":
            error_dict["email"] = "Enter Email Address"
        if email and not email_validation(email):
            error_dict["email"] = "Invalid Email"
        if len(error_dict) > 0:
            return JsonResponse({"status": "error_dict", "error_dict": error_dict})
        created_data = SubCompany.objects.create(
            location=location,
            photo=company_image,
            company_id=company_data,
            company_name=company_name,
            phone=phone,
            email=email,
            gst_number = gst_number
        )
        created_serializer = SubCompanySerializer(created_data).data
        company_count = SubCompany.objects.filter(
            company_id=company_data, is_active=True
        ).count()
        return JsonResponse(
            {
                "status": "success",
                "created_serializer": created_serializer,
                "company_count": company_count,
            }
        )

@login_required(login_url="logout_view")
def edit_subcompany_action(request, id):
    data = {key: value.strip() for key, value in request.POST.items()}
    if request.method == "POST":
        company_name = data["company_name1"]
        phone = data["phone1"]
        email = data["email1"]
        location = data["location1"]
        gst_number = data["gst_number"]
        company_image1 = request.FILES.get("company_image1")
        error_dict = {}
        if company_name == "" or company_name == None:
            error_dict["company_name1"] = "Enter Company Name"
        if company_name != "" and len(company_name) >= 100:
            error_dict["company_name1"] = "Company Name Too Large"
        if phone == "":
            error_dict["phone1"] = "Enter Phobe Number"
        if phone != "" and len(phone) < 10:
            error_dict["phone1"] = "Invalid Phone Number"
        if location == "":
            error_dict["location1"] = "Enter Location"
        if email == "":
            error_dict["email1"] = "Enter Email Address"
        if email and not email_validation(email):
            error_dict["email1"] = "Invalid Email"
        if len(error_dict) > 0:
            return JsonResponse({"status": "error_dict", "error_dict": error_dict})
        update_data = SubCompany.objects.filter(id=id)
        before_update = SubCompanySerializer(update_data, many=True).data
        if data["delete_image_input_update_sub_company_image"]:
            update_data.update(photo=None)
        if company_image1:
            update_image = update_data.first()
            update_image.photo = company_image1
            update_image.save()
        update_data.update(
            company_name=company_name, email=email, phone=phone, location=location,gst_number = gst_number
        )
        after_update = SubCompanySerializer(update_data, many=True).data
        if before_update == after_update:
            return JsonResponse({"status": "no_update"})
        else:
            return JsonResponse({"status": "success", "after_update": after_update})

@login_required(login_url="logout_view")
def delete_subcompany(request, id):
    user_id = request.user
    company_data = Company.objects.get(authuser=user_id)
    delete_data = SubCompany.objects.get(id=id)
    customer_data = Costumer.objects.filter(subcompany_id=id)
    if customer_data:
        return JsonResponse({"status": "error"})
    else:
        delete_data.delete()
        company_count = SubCompany.objects.filter(
            company_id=company_data, is_active=True
        ).count()
        return JsonResponse({"status": "success", "company_count": company_count})

@login_required(login_url="logout_view")
def inactive_company_action(request, id):
    user_id = request.user
    company_data = Company.objects.get(authuser=user_id)
    company_id = SubCompany.objects.get(id=id)
    company_id.is_active = not company_id.is_active
    company_id.save()
    company_count = SubCompany.objects.filter(
        company_id=company_data, is_active=True
    ).count()
    return JsonResponse({"status": "success", "company_count": company_count})

@login_required(login_url="logout_view")
def category_search(request):
    user_id = request.user
    company_data = Company.objects.get(authuser=user_id.id)
    subcompany_id = request.GET.get("subcompany_id")
    category_data = ProductCategory.objects.filter(
        company_id=company_data.id, subcompany_id=subcompany_id
    )
    data_value = request.GET.get("search_value").strip()
    data_search = ProductCategory.objects.filter(
        category_name__contains=data_value,
        company_id=company_data.id,
        subcompany_id=subcompany_id,
    )
    return render(
        request,
        "append_category_data.html",
        {"data_search": data_search, "category_data": category_data},
    )

@login_required(login_url="logout_view")
def subcompany_search(request):
    user_id = request.user
    company_data = Company.objects.get(authuser=user_id.id)
    data_value = request.GET.get("search_value").strip()
    subcompany_data = SubCompany.objects.filter(
        company_id=company_data.id, is_active=True
    )
    data_search = SubCompany.objects.filter(
        company_name__contains=data_value, company_id=company_data.id, is_active=True
    )
    return render(
        request,
        "append_subcompany_data.html",
        {
            "data_search": data_search,
            "subcompany_data": subcompany_data,
        },
    )

@login_required(login_url="logout_view")
def product_search(request):
    user_id = request.user
    company_data = Company.objects.get(authuser=user_id.id)
    data_value = request.GET.get("search_value").strip()
    subcompany_id = request.GET.get("subcompany_id")
    product_data = ProductMaster.objects.filter(
        company_id=company_data.id, subcompany_id=subcompany_id
    )
    data_search = ProductMaster.objects.filter(
        product_name__contains=data_value,
        company_id=company_data.id,
        subcompany_id=subcompany_id,
        delete_status=True,
    )
    return render(
        request,
        "append_product_data.html",
        {
            "data_search": data_search,
            "product_data": product_data,
        },
    )

@login_required(login_url="logout_view")
def customer_search(request):
    user_id = request.user
    company_data = Company.objects.get(authuser=user_id.id)
    data_value = request.GET.get("search_value").strip()
    subcompany_id = request.GET.get("subcompany_id")
    customer_data = Costumer.objects.filter(
        company_id=company_data.id, subcompany_id=subcompany_id
    )
    data_search = Costumer.objects.filter(
        customer_firstname__contains=data_value,
        company_id=company_data.id,
        subcompany_id=subcompany_id,
    )
    return render(
        request,
        "append_customer_data.html",
        {"data_search": data_search, "customer_data": customer_data},
    )


# generate pdf
from django.shortcuts import HttpResponse
from .pdf import html2pdf
from django.template.loader import get_template
from xhtml2pdf import pisa

@login_required(login_url="logout_view")
def pdf(request):
    id = request.GET.get("id")
    customer = Costumer.objects.get(id=id)
    product_data = CustomerProductDetails.objects.filter(customer_id=customer.id)
    
    pdf_bytes = html2pdf(
        "basic_invoice.html",
        {
            "customer": customer,
            "product_data": product_data,
        },
    )

    if pdf_bytes:
        # To display the PDF in the browser (inline), set content disposition as 'inline'
        response = HttpResponse(pdf_bytes, content_type="application/pdf")
        
        # When displaying in the browser, use 'inline' to show the PDF directly
        response['Content-Disposition'] = f'inline; filename="{customer.customer_firstname} {customer.customer_lastname}_{customer.order_id}_invoice.pdf"'
        
        return response
    else:
        return HttpResponse("Error generating PDF", status=500)




from django.core.mail import EmailMessage

@login_required(login_url="logout_view")
def html_to_pdf(request):
    id = request.GET.get("id")
    data = Costumer.objects.get(id=id)
    product_data = CustomerProductDetails.objects.filter(customer_id=data.id)
    sub_total_amount = float(data.total_discount_amount) + float(data.total_amount)
    sub_total_amount -= float(data.total_tax_amount)
    sub_total_amount = round(sub_total_amount, 2)
    order_id = data.order_id
    template = get_template("basic_invoice.html")
    html = template.render(
        {
            "data": data,
            "product_data": product_data,
            "sub_total_amount": sub_total_amount,
            "order_id": order_id,
        }
    )
    response = HttpResponse(content_type="application/pdf")
    response["Content-Disposition"] = 'attachment; filename="Invoice"'
    pisa_status = pisa.CreatePDF(html, dest=response)
    if pisa_status.err:
        return HttpResponse("Failed to generate PDF: %s" % pisa_status.err)
    return response


from core.settings import EMAIL_HOST_USER

@login_required(login_url="logout_view")
def send_html_to_pdf(request):
    id = request.GET.get("id")
    data = Costumer.objects.get(id=id)
    product_data = CustomerProductDetails.objects.filter(customer_id=data.id)
    sub_total_amount = float(data.total_discount_amount) + float(data.grand_total_amount)
    sub_total_amount -= float(data.total_tax_amount)
    sub_total_amount = round(sub_total_amount, 2)
    template = get_template("basic_invoice.html")
    html = template.render(
        {
            "data": data,
            "product_data": product_data,
            "sub_total_amount": sub_total_amount,
        }
    )
    response = HttpResponse(content_type="application/pdf")
    response["Content-Disposition"] = 'attachment; filename="Invoice"'
    pisa_status = pisa.CreatePDF(html, dest=response)

    recipient_mail = data.customer_email
    subject = "Invoice"
    message = "Hi Sir/Ma'am"
    sender = EMAIL_HOST_USER
    recipient = [recipient_mail]

    email1 = EmailMessage(subject, message, sender, recipient)
    email1.attach(
        "Invoice.pdf", response.getvalue(), "application/pdf"
    )  # Attach the PDF file
    email1.send()

    if pisa_status.err:
        return HttpResponse("Failed to generate PDF: %s" % pisa_status.err)
    return response
