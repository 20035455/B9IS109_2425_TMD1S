# Project modules
from .models import *

# Restframework modules
from rest_framework import serializers


class SubCompanySerializer(serializers.ModelSerializer):
    company_id = serializers.SerializerMethodField()

    class Meta:
        model = SubCompany
        fields = (
            "id",
            "company_id",
            "company_name",
            "email",
            "phone",
            "photo",
            "is_active",
            "location",
            "gst_number"
        )

    def get_company_id(self, obj):
        return obj.company_id.authuser.username


class CategorySerializer(serializers.ModelSerializer):
    company_id = serializers.SerializerMethodField()
    subcompany_id = serializers.SerializerMethodField()

    class Meta:
        model = ProductCategory
        fields = ["category_name", "id", "company_id", "subcompany_id"]

    def get_company_id(self, obj):
        return obj.company_id.authuser.username

    def get_subcompany_id(self, obj):
        return obj.subcompany_id.company_name


class ProductSerializer(serializers.ModelSerializer):
    category_id = serializers.SerializerMethodField()
    company_id = serializers.SerializerMethodField()
    subcompany_id = serializers.SerializerMethodField()

    class Meta:
        model = ProductMaster
        fields = [
            "id",
            "product_company_name",
            "product_name",
            "supplier_name",
            "product_description",
            "inventory_location",
            "purchase_amount",
            "product_hsn",
            "number",
            "photo",
            "active_status",
            "booked_count",
            "product_left_count",
            "category_id",
            "company_id",
            "subcompany_id",
            "total_amount",
            "product_code",
            "gst_percentage",
            "gst_amount",
            "cgst_percentage",
            "cgst_amount",
            "sgst_percentage",
            "sgst_amount",
        ]

    def get_category_id(self, obj):
        return obj.category_id.category_name

    def get_company_id(self, obj):
        return obj.company_id.authuser.username

    def get_subcompany_id(self, obj):
        return obj.subcompany_id.company_name


class CustomerSerializer(serializers.ModelSerializer):
    company_id = serializers.SerializerMethodField()
    subcompany_id = serializers.SerializerMethodField()
    payment_method = serializers.SerializerMethodField()

    class Meta:
        model = Costumer
        fields = '__all__'

    def get_company_id(self, obj):
        return obj.company_id.authuser.username

    def get_subcompany_id(self, obj):
        return obj.subcompany_id.company_name

    def get_payment_method(self, obj):
        return obj.payment_method
