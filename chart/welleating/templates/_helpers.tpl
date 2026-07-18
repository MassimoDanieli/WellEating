{{- define "welleating.name" -}}
{{- .Chart.Name -}}
{{- end -}}

{{- define "welleating.fullname" -}}
{{- printf "%s-%s" .Release.Name .Chart.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "welleating.labels" -}}
app.kubernetes.io/name: {{ include "welleating.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{- define "welleating.selectorLabels" -}}
app.kubernetes.io/name: {{ include "welleating.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}
