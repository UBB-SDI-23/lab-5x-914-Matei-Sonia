from django.core.paginator import Paginator
from django.db.models import Avg, Count, Subquery, OuterRef
from django.db.models.functions import Length, Coalesce
from rest_framework.generics import get_object_or_404

from passwords.serializers import *
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.decorators import api_view


class FilterVaults(generics.ListAPIView):
    serializer_class = VaultSerializerList

    def get_queryset(self):
        vaults = Vault.objects.filter(created_at__year__gt=self.kwargs['year'])
        paginator = Paginator(vaults.order_by("id"), 25)
        page_number = self.request.query_params.get("page")
        page_obj = paginator.get_page(page_number)

        return page_obj.object_list


@api_view(['GET'])
def get_number_vaults_filter(request, year):
    if request.method == "GET":
        return Response(
            {
                "number": len(Vault.objects.filter(created_at__year__gt=year))
            }
        )


@api_view(['GET'])
def get_number_vaults(request):
    if request.method == "GET":
        return Response(
            {
                "number": Vault.objects.count()
            }
        )


@api_view(['GET'])
def get_number_passwacc(request):
    if request.method == "GET":
        return Response(
            {
                "number": PasswordAccount.objects.count()
            }
        )


@api_view(['GET'])
def get_number_passwcls(request):
    if request.method == "GET":
        return Response(
            {
                "number": PasswordClassic.objects.count()
            }
        )


@api_view(['GET'])
def get_number_tags(request):
    if request.method == "GET":
        return Response(
            {
                "number": Tag.objects.count()
            }
        )


class VaultList(generics.ListCreateAPIView):
    serializer_class = VaultSerializerList

    def get_serializer(self, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        kwargs.setdefault("context", self.get_serializer_context())
        serializer = serializer_class(*args, **kwargs)
        if self.request.method == "GET":
            serializer.child.fields['nb_acc'] = serializers.IntegerField()
        return serializer

    def get_queryset(self):
        # vaults = Vault.objects.all().annotate(nb_acc=Count("account_passwords"))
        vaults = Vault.objects.annotate(
                nb_acc=Coalesce(Subquery(
                    PasswordAccount.objects.filter(vault=OuterRef('pk')).values('vault').annotate(count=Count('id')).values('count')
                ), 0)
            )
        paginator = Paginator(vaults, 25)
        page_number = self.request.query_params.get("page")
        page_obj = paginator.get_page(page_number)

        return page_obj.object_list


class VaultDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Vault.objects.all()
    serializer_class = VaultSerializerDetails


class TagList(generics.ListCreateAPIView):
    serializer_class = TagSerializerList

    def get_serializer(self, *args, **kwargs):
        serializer = super().get_serializer(*args, **kwargs)
        serializer.child.fields['nb_acc'] = serializers.IntegerField()
        return serializer

    def get_queryset(self):
        # tags = Tag.objects.all().annotate(nb_acc=Count("tagged_passwords"))
        tags = Tag.objects.annotate(
            nb_acc=Coalesce(Subquery(
                TagPassword.objects.filter(tag=OuterRef('pk')).values('tag').annotate(
                    count=Count('id')).values(
                    'count')
            ), 0)
        )
        paginator = Paginator(tags, 25)
        page_number = self.request.query_params.get("page")
        page_obj = paginator.get_page(page_number)

        return page_obj.object_list


class TagDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializerDetails


class PasswordAccountList(generics.ListCreateAPIView):
    serializer_class = PasswordAccountSerializerList
    def get_serializer(self, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        kwargs.setdefault("context", self.get_serializer_context())
        serializer = serializer_class(*args, **kwargs)
        if self.request.method == "GET":
            serializer.child.fields['nb_tgs'] = serializers.IntegerField()
        return serializer

    def get_queryset(self):
        # passws = PasswordAccount.objects.all().annotate(nb_tgs=Count("tags"))
        passws = PasswordAccount.objects.annotate(
            nb_tgs=Coalesce(Subquery(
                TagPassword.objects.filter(password=OuterRef('pk')).values('password').annotate(count=Count('id')).values(
                    'count')
            ), 0)
        )
        paginator = Paginator(passws, 25)
        page_number = self.request.query_params.get("page")
        page_obj = paginator.get_page(page_number)

        return page_obj.object_list


class PasswordAccountDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = PasswordAccount.objects.all()
    serializer_class = PasswordAccountSerializerDetails


class PasswordClassicList(generics.ListCreateAPIView):
    serializer_class = PasswordClassicSerializerList

    def get_queryset(self):
        passws = PasswordClassic.objects.all()
        paginator = Paginator(passws, 25)
        page_number = self.request.query_params.get("page")
        page_obj = paginator.get_page(page_number)

        return page_obj.object_list


class PasswordClassicDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = PasswordClassic.objects.all()
    serializer_class = PasswordClassicSerializerDetails


class TagAccountPasswordList(APIView):
    def post(self, request, pk):
        request.data["password"] = pk
        serializer = TagPasswordSerializer(data=request.data)
        serializer.fields['tag'] = serializers.PrimaryKeyRelatedField(queryset=Tag.objects.all())
        # serializer.fields['password'] = serializers.PrimaryKeyRelatedField(queryset=PasswordAccount.objects.all())
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TagAccountPasswordDetails(APIView):
    @staticmethod
    def get_object(pwd_id, tag_id):
        try:
            return TagPassword.objects.get(password=pwd_id, tag=tag_id)
        except TagPassword.DoesNotExist:
            raise Http404

    def patch(self, request, pwd_id, tag_id):
        relation = self.get_object(pwd_id, tag_id)
        serializer = TagPasswordSerializer(instance=relation, data=request.data, partial=True, exclude_fields=["tag", "password"])
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pwd_id, tag_id):
        relation = self.get_object(pwd_id, tag_id)
        relation.delete()
        return Response({"message": "Deleted."})

#1834


class AccountPasswordTagList(APIView):
    def post(self, request, pk):
        request.data["tag"] = pk
        serializer = TagPasswordSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderVaultsByPasswords(generics.ListAPIView):
    serializer_class = VaultOrderSerializerList

    def get_queryset(self):
        queryset = Vault.objects.annotate(avg_password_length=Avg(Length('account_passwords__password'))).order_by("-avg_password_length")
        paginator = Paginator(queryset, 25)
        page_number = self.request.query_params.get("page")
        page_obj = paginator.get_page(page_number)

        return page_obj.object_list
        # return queryset


class OrderPasswordsByTags(generics.ListCreateAPIView):
    serializer_class = OrderPasswordsByTagsSerializer

    def get_queryset(self):
        # queryset = PasswordAccount.objects.annotate(count_tags=Count("tags")).order_by("-count_tags")
        queryset = PasswordAccount.objects.annotate(
            count_tags=Coalesce(Subquery(
                TagPassword.objects.filter(password=OuterRef('pk')).values('password').annotate(
                    count=Count('id')).values(
                    'count')
            ), 0)
        ).order_by("-count_tags")
        paginator = Paginator(queryset, 25)
        page_number = self.request.query_params.get("page")
        page_obj = paginator.get_page(page_number)

        return page_obj.object_list


class MultipleTagsToVault(APIView):
    def post(self, request, pk):
        tags = []

        for tag_data in request.data:
            tags.append(get_object_or_404(Tag, pk=tag_data['id']))

        for i, tag_data in enumerate(request.data):
            tag_data['vault'] = pk
            serializer = TagSerializerDetails(tags[i], data=tag_data, partial=True)
            serializer.fields['vault'] = serializers.PrimaryKeyRelatedField(queryset=Vault.objects.all())

            if serializer.is_valid():
                serializer.save()
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_200_OK)


class VaultViewForAutocomplete(APIView):
    serializer_class = VaultSerializerList

    def get(self, request, *args, **kwargs):

        query = request.GET.get('query')
        vaults = Vault.objects.filter(title__icontains=query).order_by('title')[:10]
        serializer = VaultSerializerList(vaults, many=True)
        return Response(serializer.data)


class TagViewForAutocomplete(APIView):
    serializer_class = TagSerializerList

    def get(self, request, pk, *args, **kwargs):
        query = request.GET.get('query')
        tags = Tag.objects.filter(title__icontains=query).filter(vault=pk).order_by('title')[:10]
        serializer = TagSerializerList(tags, many=True)
        return Response(serializer.data)
