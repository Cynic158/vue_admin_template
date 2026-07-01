FROM nginx

#将dist目录内容复制到nginx容器html内部
COPY dist /usr/share/nginx/html/

EXPOSE 80

#COPY default.conf /etc/nginx/conf.d/default.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]