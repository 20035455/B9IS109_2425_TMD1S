from django.db import models
from django.contrib.auth.models import User
import datetime
import uuid

# Create your models here.


class AuditBase(models.Model):
    created_by = models.ForeignKey(
        User,
        related_name="%(app_label)s_%(class)s_ownership",
        on_delete=models.CASCADE,
        null=True
    )
    created_dSubCompanyt = models.DateField(auto_now_add=True)
    updated_by = models.ForeignKey(
        User,
        related_name="%(app_label)s_%(class)s_ownership1",
        on_delete=models.CASCADE,
        null=True,
    )
    updated_dt = models.DateField(auto_now=True)
    created_tm = models.TimeField(auto_now_add=True)
    updated_tm = models.TimeField(auto_now=True)
    status = models.CharField(max_length=10, null=True)
    class Meta:
        abstract = True

class Company(AuditBase):
    authuser = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    email = models.EmailField(unique=True)
    permission = models.BooleanField(default=False)


class SubCompany(AuditBase):
    uid = models.UUIDField(default=uuid.uuid4)
    company_id = models.ForeignKey(Company, on_delete=models.CASCADE, null=True)
    company_name = models.CharField(max_length=50, null=True)
    email = models.CharField(max_length=100, null=True)
    phone = models.CharField(max_length=15, null=True)
    photo = models.FileField(upload_to="company", null=True)
    location = models.CharField(max_length=200, null=True)
    gst_number = models.CharField(max_length=250, null=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ("-id",)


class ProductCategory(AuditBase):
    company_id = models.ForeignKey(Company, on_delete=models.CASCADE, null=True)
    subcompany_id = models.ForeignKey(
        SubCompany, on_delete=models.CASCADE, null=True
    )
    category_name = models.CharField(max_length=50, null=True)

    class Meta:
        ordering = ("-id",)


class ProductMaster(AuditBase):
    uid = models.UUIDField(default=uuid.uuid4)
    category_id = models.ForeignKey(
        ProductCategory,
        on_delete=models.CASCADE,
        null=True,
        related_name="EventBooth_ctaegoryid",
    )
    company_id = models.ForeignKey(Company, on_delete=models.CASCADE, null=True)
    subcompany_id = models.ForeignKey(
        SubCompany, on_delete=models.CASCADE, null=True
    )
    product_name = models.CharField(max_length=255, null=False)
    supplier_name = models.CharField(max_length=255, null=True)
    product_description = models.TextField(null=True)
    inventory_location = models.CharField(max_length=255, null=True)
    purchase_amount = models.CharField(max_length=255, null=True)
    product_hsn = models.CharField(max_length=255, null=True)
    number = models.TextField(null=True)
    photo = models.FileField(upload_to="product_pic", null=True)
    active_status = models.BooleanField(default=True)
    booked_count = models.IntegerField(null=True)
    product_left_count = models.IntegerField(null=True)
    delete_status = models.BooleanField(default=True)
    product_company_name = models.CharField(max_length=255, null=True)
    quantity_for_amount = models.TextField(null=True)
    product_code = models.CharField(max_length=255, null=True)
    sale_price_without_gst = models.DecimalField(
        max_digits=50, decimal_places=2, default=0
    )
    total_amount = models.DecimalField(max_digits=50, decimal_places=2, default=0)
    gst_percentage = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    gst_amount = models.DecimalField(max_digits=10000, decimal_places=2, default=0)
    cgst_percentage = models.DecimalField(max_digits=10000, decimal_places=2, default=0)
    cgst_amount = models.DecimalField(max_digits=10000, decimal_places=2, default=0)
    sgst_percentage = models.DecimalField(max_digits=10000, decimal_places=2, default=0)
    sgst_amount = models.DecimalField(max_digits=10000, decimal_places=2, default=0)

    class Meta:
        ordering = ("-id",)


payment_method_choices = (
    ("cash", "cash"),
    ("gpay", "gpay"),
    ("bank", "bank"),
)


class Costumer(AuditBase):
    uid = models.UUIDField(default=uuid.uuid4)
    company_id = models.ForeignKey(Company, on_delete=models.CASCADE, null=True)
    subcompany_id = models.ForeignKey(
        SubCompany, on_delete=models.CASCADE, null=True
    )
    customer_firstname = models.TextField(null=False, db_index=True)
    customer_lastname = models.TextField(null=True, db_index=True)
    customer_email = models.EmailField(max_length=254)
    customer_image = models.FileField(upload_to="customer_image", null=True)
    customer_phone_no = models.CharField(max_length=255, null=True)
    payment_method = models.CharField(max_length=25, choices=payment_method_choices)
    gst_pecentage = models.CharField(max_length=10, null=True)
    order_id = models.CharField(max_length=10, null=True)
    date = models.DateField(default=datetime.date.today)
    profit = models.CharField(max_length=255, null=True)
    total_product_quantity = models.CharField(max_length=255, null=True,default= 0)
    total_product = models.CharField(max_length=255, null=True,default= 0)
    total_tax_amount = models.CharField(max_length=255, null=True,default= 0)
    total_discount_amount = models.CharField(max_length=255, null=True,default= 0)
    sub_total_amount = models.CharField(max_length=255, null=True)
    grand_total_amount = models.CharField(max_length=255, null=True,default= 0)
    cgst_amount = models.DecimalField(max_digits=10000, decimal_places=2, default=0)
    sgst_amount = models.DecimalField(max_digits=10000, decimal_places=2, default=0)
    class Meta:
        ordering = ("-id",)


class CustomerProductDetails(AuditBase):
    uid = models.UUIDField(default=uuid.uuid4)
    customer_id = models.ForeignKey(Costumer, on_delete=models.CASCADE, null=True)
    customer_product = models.ForeignKey(ProductMaster,on_delete=models.SET_NULL,null=True,related_name="EventExhibitor_eventbooth_id")
    product_name = models.CharField(max_length=255, null=True)
    product_sale_price = models.DecimalField(max_digits=10000, decimal_places=2, default=0)
    product_quantity = models.IntegerField(null=True)
    discount_percentage = models.CharField(max_length=255, null=True)
    discount_amount = models.CharField(max_length=255, null=True)
    gst_percentage = models.CharField(max_length=255, null=True)
    gst_amount = models.CharField(max_length=255, null=True)
    total_amount = models.CharField(max_length=255, null=True)
