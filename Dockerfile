ARG image_fyllut_base
ARG monorepo_git_sha
FROM $image_fyllut_base:$monorepo_git_sha

ENV SKJEMA_DIR /app/skjema/
ENV RESOURCES_DIR /app/resources/
ENV TRANSLATION_DIR /app/translation/

ARG git_sha
ARG skjema_dir
ARG resources_dir
ARG translation_dir

COPY $skjema_dir/ $SKJEMA_DIR
COPY $resources_dir/ $RESOURCES_DIR
COPY $translation_dir/ $TRANSLATION_DIR

ENV GIT_SHA=${git_sha}
